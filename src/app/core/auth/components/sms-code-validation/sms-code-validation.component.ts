import { 
  Component, 
  OnInit, 
  signal, 
  inject, 
  input, 
  EventEmitter, 
  Output 
} from '@angular/core';
import { 
  FormBuilder, 
  FormGroup, 
  Validators, 
  ReactiveFormsModule 
} from '@angular/forms';
import { 
  ActivatedRoute, 
  Router, 
  RouterModule 
} from '@angular/router';
import { interval, Subscription, take } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

import { ExternalAuthService } from '../../services/external-auth.service';
import { RegistrationCodeValidation, Send2AuthCodeSMS } from '../../interfaces/external';
import { toastrGlobalConfig } from '../../../../core/configs/toastr.config';

@Component({
  selector: 'app-sms-code-validation',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, TranslateModule],
  templateUrl: './sms-code-validation.component.html',
  styleUrls: ['./sms-code-validation.component.scss']
})
export default class SmsCodeValidationComponent implements OnInit {
  
  /** Inyecciones de servicios */
  private toastService = inject(ToastrService);
  private fb = inject(FormBuilder);
  private authService = inject(ExternalAuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private translate = inject(TranslateService);

  /** Signals y propiedades */
  lastDigits = signal('1234'); 
  isLoading = signal(false);
  isResending = signal(false);
  errorMessage = signal('');
  countdown = signal(0);
  token = signal('');
  smsSend = signal(false);

  /** Formulario y referencias */
  smsForm: FormGroup;
  codeFields = Array(6).fill(0);

  /** Inputs (Angular signals) */
  phoneNumberEnds = input();
  userId = input<string>();

  /** Outputs */
  @Output() validationComplete = new EventEmitter<{
    isValid: boolean;
    data: RegistrationCodeValidation;
  }>();

  /** Subscripciones */
  private countdownSub?: Subscription;

  constructor() {
    this.smsForm = this.initForm();
  }

  ngOnInit(): void {
    // Inicia el contador de reenvío
    this.startCountdown(30);
  }

  /**
   * Inicializa el formulario con 6 controles para cada dígito.
   */
  private initForm(): FormGroup {
    const group = this.fb.group({});
    this.codeFields.forEach((_, i) => {
      group.addControl(
        `digit${i}`,
        this.fb.control({ value: '', disabled: true }, [
          Validators.required,
          Validators.pattern('[0-9]')
        ])
      );
    });
    return group;
  }

  /**
   * Maneja el evento de keyup para avanzar el focus y validar el formulario.
   * @param event Tecla presionada
   * @param index Índice del dígito
   */
  onKeyUp(event: KeyboardEvent, index: number): void {
    const input = event.target as HTMLInputElement;
    const value = input.value;

    // Mover focus al siguiente dígito si el actual está lleno
    if (value && index < this.codeFields.length - 1) {
      const nextInput = document.querySelector(
        `[formControlName="digit${index + 1}"]`
      ) as HTMLInputElement;
      if (nextInput) nextInput.focus();
    }

    // Si todos los campos están completos, enviamos el formulario
    if (this.isFormComplete()) {
      this.onSubmit();
    }
  }

  /**
   * Maneja el evento de pegar (paste) para rellenar todos los dígitos de una sola vez.
   * @param event ClipboardEvent
   */
  onPaste(event: ClipboardEvent): void {
    event.preventDefault();
    const clipboardData = event.clipboardData?.getData('text').trim();

    if (clipboardData && /^\d+$/.test(clipboardData)) {
      const digits = clipboardData.split('').slice(0, this.codeFields.length);

      digits.forEach((digit, i) => {
        this.smsForm.get(`digit${i}`)?.setValue(digit);
      });

      // Si se pegaron todos los dígitos, intentar envío
      if (digits.length === this.codeFields.length) {
        this.onSubmit();
      }
    }
  }

  /**
   * Verifica si el formulario está completo y válido.
   */
  private isFormComplete(): boolean {
    return this.smsForm.valid;
  }

  /**
   * Obtiene el código completo a partir de los campos del formulario.
   */
  private getFullCode(): string {
    return Object.values(this.smsForm.value).join('');
  }

  /**
   * Envía los datos del formulario para validar el código de registro.
   */
  async onSubmit(): Promise<void> {
    if (this.smsForm.invalid) return;

    this.isLoading.set(true);
    this.errorMessage.set('');

    const code = this.getFullCode();

    // Estructura de datos para la validación
    const data: RegistrationCodeValidation = {
      validationCode: code,
      token: this.token(), // Aquí reemplaza con la lógica real si aplica
      userId: this.userId()!
    };

    this.authService.registrationCodeValidation(data).subscribe({
      next: (resp: any) => {
        console.log('Validación de token SMS y código:', resp);

        if (resp.isValid || resp.isTokenValid) {
          this.toastService.success(
            this.translate.instant('smsCodeValidation.successNumberConfirmed'),
            this.translate.instant('smsCodeValidation.successTitle'),
            { ...toastrGlobalConfig }
          );
          // Emitimos evento al padre con el resultado de la validación
          this.validationComplete.emit({ isValid: true, data });
        } else {
          this.toastService.error(
            this.translate.instant('smsCodeValidation.invalidCode'),
            this.translate.instant('smsCodeValidation.invalidCodeTitle'),
            { ...toastrGlobalConfig }
          );
          this.resetForm();
          this.startCountdown(0);
        }
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
      }
    });
  }

  /**
   * Pone en marcha el contador de reenvío de código.
   * @param seconds Número de segundos para el contador
   */
  private startCountdown(seconds: number): void {
    if (this.countdownSub) {
      this.countdownSub.unsubscribe();
    }
    this.countdown.set(seconds);

    this.countdownSub = interval(1000).pipe(take(seconds)).subscribe(() => {
      this.countdown.update(val => val - 1);
    });
  }

  /**
   * Solicita un nuevo código al servicio.
   */
  requestCode(): void {
    this.smsForm.reset();
    const data: Send2AuthCodeSMS = {
      userId: this.userId()!,
      twoAuthOperation: 0
    };

    this.authService.send2AuthCode(data).subscribe({
      next: (resp) => {
        console.log('Solicitud de código enviada:', resp);
        this.toastService.success(
          this.translate.instant('smsCodeValidation.successCodeSent'),
          this.translate.instant('smsCodeValidation.successTitle'),
          { ...toastrGlobalConfig }
        );

        // Guardamos token recibido
        this.token.set(resp);

        // Reiniciamos el formulario y el contador
        this.resetForm(false);
        this.startCountdown(30);

        // Habilitar todos los controles del formulario
        Object.keys(this.smsForm.controls).forEach(controlName => {
          this.smsForm.get(controlName)?.enable();
        });

        this.smsSend.set(true);
      },
      error: () => {
        this.toastService.error(
          this.translate.instant('smsCodeValidation.errorSendCode'),
          this.translate.instant('smsCodeValidation.errorTitle'),
          { ...toastrGlobalConfig }
        );
      }
    });
  }

  /**
   * Reinicia el formulario y coloca el foco en el primer campo si así se indica.
   * @param shouldFocus Indica si se hace focus al primer campo
   */
  private resetForm(shouldFocus = true): void {
    this.smsForm.reset();
    if (shouldFocus) {
      const firstInput = document.querySelector(
        '[formControlName="digit0"]'
      ) as HTMLInputElement;
      if (firstInput) firstInput.focus();
    }
  }
}

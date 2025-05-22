import { Component, computed, effect, inject, input, OnInit, signal, WritableSignal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormUtils } from '../../../../core/utils/utils-forms';
import { RouterLink, Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ExternalAuthService } from '../../services/external-auth.service';
import SmsCodeValidationComponent from "../sms-code-validation/sms-code-validation.component";
import { ToastrService } from 'ngx-toastr';
import { ChangePasswordRequest, RegistrationCodeValidation } from '../../interfaces/external';
import { SetPassword } from '../../interfaces/external/ISetPassword';
import { SetPasswordResponse } from '../../interfaces/external/ISetPasswordResponse';
import { retry } from 'rxjs';
import { toastrGlobalConfig } from '../../../../core/configs/toastr.config';
import { sign } from 'crypto';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, TranslateModule, CommonModule, SmsCodeValidationComponent],
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.scss'
})
export default class ChangePasswordComponent implements OnInit {
    private toast = inject(ToastrService)
  
  authExternalService = inject(ExternalAuthService)
  formUtils = FormUtils;
  fb = inject(NonNullableFormBuilder);
  translateService = inject(TranslateService);
  route = inject(ActivatedRoute);
  router = inject(Router);

  // Propiedades para visualización
  showPassword = false;
  showConfirmPassword = false;
  hasMinLength = false;
  hasUpperCase = false;
  hasLowerCase = false;
  hasNumber = false;
  hasSpecialChar = false;
  hasNoSpaces = true;
  hasNoRepeatedChars = true;

  userId= signal('');
  code = signal('');
  token = signal('');
  phoneNumberEnds= signal('');

  enableOldPassword = input<boolean>(false)
  showChangePassword: WritableSignal<boolean> = signal(false);

  constructor() {
    this.validateInitialInput();
  }

  changePasswordForm = this.fb.group({
    newPassword: ['', [
      Validators.required,
      Validators.minLength(8),
      Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#\$%&@\?\*])(?=\S+$).*$/),
      FormUtils.noRepeatedCharactersValidator
    ]],
    confirmPassword: ['', [Validators.required]]
  }, { validators: FormUtils.passwordsMatchValidator });

  ngOnInit() {
    // Inicializar el servicio de traducción en FormUtils
    FormUtils.setTranslateService(this.translateService);
    // Comprobar el estado inicial de la contraseña
    this.onPasswordInput();

    if (this.enableOldPassword()) {
      (this.changePasswordForm as any).addControl('oldPassword', this.fb.control('', [Validators.required,
        Validators.minLength(8),]));
    }
  }

  // Actualizar estados
  onPasswordInput() {
    const value = this.changePasswordForm.get('newPassword')?.value || '';
    this.hasMinLength = value.length >= 8;
    this.hasUpperCase = /[A-Z]/.test(value);
    this.hasLowerCase = /[a-z]/.test(value);
    this.hasNumber = /\d/.test(value);
    this.hasSpecialChar = /[#\$%&@\?\*]/.test(value);
    this.hasNoSpaces = !/\s/.test(value);
    this.hasNoRepeatedChars = !/(.)\1{1,}/.test(value);
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  onSubmit() {
    this.changePasswordForm.markAllAsTouched();

    if(this.enableOldPassword()){
      this.secondSubmit();
    }

    if(!this.enableOldPassword()){
      this.firstSubmit();
    }

  }


  firstSubmit() {
    if (this.changePasswordForm.valid) {
      const data: SetPassword ={
        userId: this.userId(),
        code: this.code(),
        password: this.changePasswordForm.controls.newPassword.value!,
        token: this.token()
      }
      this.authExternalService.setPassword(data).subscribe(
        {
          next: (res: SetPasswordResponse) => {
            if(!res.isValid){
              this.toast.error('Ocurrió un error al cambiar la contraseña.', 'Error',{ ...toastrGlobalConfig });
              return;
            }

              this.toast.success('La contraseña se cambió correctamente.', 'Éxito',{ ...toastrGlobalConfig });
              this.router.navigate(['/login']);
          },
          error: (error) => {
            this.toast.error('Intentalo nuevamente.', 'Error',{ ...toastrGlobalConfig });
          },
        }
      )

    } else {
      console.log('El formulario contiene errores:', this.changePasswordForm.errors);
    }
  }

  secondSubmit() {
    console.log(
      'Form change password send:', this.changePasswordForm.value
    )

    if (this.changePasswordForm.valid) {
      const oldPasswordControl = this.changePasswordForm.get('oldPassword');

      const data: ChangePasswordRequest = {
        currentPassword: oldPasswordControl?.value ?? '',
        newPassword: this.changePasswordForm.controls.newPassword.value!,
        email: ''
      };
      
      this.authExternalService.changePassword(data).subscribe(
        {
          next: (res: any) => {
            if (res.success) {
              this.toast.success('La contraseña se cambió correctamente.', 'Éxito',{ ...toastrGlobalConfig });
            } else {
              this.toast.error('Ocurrió un error al cambiar la contraseña.', 'Error',{ ...toastrGlobalConfig });
            }
          },
          error: (error) => {
            this.toast.error('Intentalo nuevamente.', 'Error',{ ...toastrGlobalConfig });
          },
        }
      )

    } else {
      console.log('El formulario contiene errores:', this.changePasswordForm.errors);
    }


  }

  onValidationComplete(event: { isValid: boolean; data: RegistrationCodeValidation }): void {
    console.log('Evento recibido del componente hijo:', event);

    if (event.isValid) {
      // Si es válido, muestra el formulario de cambio de contraseña
      this.showChangePassword.set(true);

      // Puedes usar la data recibida si es necesario
      //console.log('Data recibida:', event.data);

      this.token.set(event.data.token)
      this.code.set(event.data.validationCode)
      return;
    } else {
      // Maneja el caso en que no sea válido
      console.error('Validación fallida. Data:', event.data);
    }
  }


  validateInitialInput() {
    effect(() => {
      console.log('Evaluating changes in main input component...:', this.enableOldPassword());
      //
      this.showChangePassword.set(this.enableOldPassword());

      //Validate if it's necessary to show the SMS validation component
      this.verifySMSComponent();


      //Destroy effect
      return () => {
        
      };

    });
  }

  verifySMSComponent() {
    if(!this.showChangePassword()){
          // Subscribe to query parameters
      this.route.queryParams.subscribe(params => {
        this.userId.set(params['userId']);
        this.code.set(params['code']) 
        
        // Now you can use this.userId and this.code in your component
        console.log('User ID:', this.userId);
        console.log('Code:', this.code);

        this.authExternalService.registrationTokenValidation({token: this.code()!, userId: this.userId()!})
        .subscribe(
          (data)=>{
            console.log('Vbalidacion dew token y usuario: ',data);
            this.phoneNumberEnds.set(data.phoneNumberEnds)
          }
        )
      });

    }
  }
}
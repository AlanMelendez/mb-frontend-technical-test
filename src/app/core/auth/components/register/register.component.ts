import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import {
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { FormUtils } from '../../../../core/utils/utils-forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ApiExternalService } from '../../../../core/services/api-external.service';
import { GetCountriesResponse } from '../../../../core/interfaces';
import { tap } from 'rxjs';
import { UserRegister } from '../../interfaces/external/IUserRegister';
import { ExternalAuthService } from '../../services/external-auth.service';
import { UserRegisterResponse } from '../../interfaces/external';
import { User } from '../../../../core/models/auth.model';
import { ToastrService } from 'ngx-toastr';
import { toastrGlobalConfig } from '../../../../core/configs/toastr.config';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, TranslateModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class RegisterComponent {

  private translate = inject(TranslateService);
  private apiExternalService = inject(ApiExternalService);
  private authExternalService = inject(ExternalAuthService);
  private toastr = inject(ToastrService);

  private router= inject(Router);


  formUtils = FormUtils;
  protected countries = signal([] as GetCountriesResponse[]) ;

  fb = inject(NonNullableFormBuilder);
  registerForm = this.fb.group({
    name: ['', [Validators.required]],
    paternalSurname: ['', [Validators.required]],
    maternalSurname: ['', [Validators.required]],
    email: [
      '',
      [
        Validators.required,
        Validators.pattern(this.formUtils.REGEX_EMAIL),
        this.formUtils.forbiddenDomainsValidator(),
      ],
    ],
    charge: ['', [Validators.required]],
    companyName: ['', [Validators.required]],
    countryCode: ['', Validators.required],
    phoneNumber: [
      '',
      [
        Validators.required,
        Validators.pattern(this.formUtils.REGEX_ONLY_NUMBERS),
        Validators.pattern(this.formUtils.REGEX_PHONE),
      ],
    ],
    privacyNotice: [false, [Validators.requiredTrue]],
  });

  ngOnInit(): void {
    this.formUtils.setTranslateService(this.translate);
    this.getInitialCountries();
  }

  getInitialCountries(){
    this.apiExternalService.getCountries()
      .pipe(
        //tap ( value => console.log('Countries: ', value))
      )
      .subscribe((countries: GetCountriesResponse[] ) => {
        this.countries.set(countries);
    });
  }



  onSubmit() {
    this.registerForm.markAllAsTouched();

    if (this.registerForm.invalid) {
      if (this.registerForm.get('privacyNotice')?.errors?.['required']) {
        this.toastr.warning(
          this.translate.instant('register.privacyNotice.requiredError'),
          this.translate.instant('ngx-ui-config.messages.error'),
          { ...toastrGlobalConfig }
        );
      }
      return;
    }
     
    const data: UserRegister  = this.registerForm.value as UserRegister;
    this.authExternalService.register(data)
      .subscribe({
            next: (response: UserRegisterResponse) => {
              this.toastr.success(``, this.translate.instant('ngx-ui-config.messages.success') , {
                ...toastrGlobalConfig,
              });
              // Redirect to homepage or perform any other action
              this.router.navigate(['/login']);
            },
            error: (error) => {
              debugger;
              this.toastr.error(`${error}`, this.translate.instant('ngx-ui-config.messages.error'), { ...toastrGlobalConfig });
            },
          })
  }
}

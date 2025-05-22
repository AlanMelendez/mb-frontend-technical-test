import { Component, inject } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormUtils } from '../../../../core/utils/utils-forms';
import { Router, RouterLink } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ExternalAuthService } from '../../services/external-auth.service';
import { ToastrService } from 'ngx-toastr';
import { toastrGlobalConfig } from '../../../../core/configs/toastr.config';

@Component({
  selector: 'app-forgot-password',
  imports: [ReactiveFormsModule, RouterLink, TranslateModule],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss'
})
export default class ForgotPasswordComponent {
  authExternalService = inject(ExternalAuthService)
  toastr = inject(ToastrService)
  translate = inject(TranslateService)

  router = inject(Router)

  formUtils = FormUtils;
  fb = inject(NonNullableFormBuilder);
  forgotPasswordForm = this.fb.group({
    email: ['', [Validators.required, Validators.pattern(this.formUtils.REGEX_EMAIL), this.formUtils.forbiddenDomainsValidator()]],
  });

  ngOnInit() {
    this.formUtils.setTranslateService(this.translate);
  }

  onSubmit() {
    this.forgotPasswordForm.markAllAsTouched();

    if (this.forgotPasswordForm.invalid) {
      this.toastr.error(this.translate.instant('forgotPassword.messages.invalidForm'), 'Error');
      return;
    }

    const email = this.forgotPasswordForm.controls.email.value;
    this.authExternalService.recoveryAccessRequest(email).subscribe(
      (res: any) => {
        if(!res.isValid){
          this.toastr.info(this.translate.instant('forgotPassword.messages.emailNotFound'), 'Advertencia', { ...toastrGlobalConfig , timeOut: 4000 });
          return;
        }

        this.toastr.success(this.translate.instant('forgotPassword.messages.successLinkSent'), 'Éxito', { ...toastrGlobalConfig, timeOut: 4000 });
        setTimeout(() => {
            this.router.navigate(['login'])
        }, 500);
        return;
      },
      (err: any) => {
        this.toastr.error(this.translate.instant('forgotPassword.messages.unexpectedError'), 'Error', { ...toastrGlobalConfig });
        console.error(err);
      }
    );
  }
}

import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ExternalAuthService } from '../../services/external-auth.service';
import { Router, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  readonly hide = signal(true);
  protected authService = inject(ExternalAuthService);
  protected fb = inject(FormBuilder);
  readonly menuOpen = signal(false);
   toast = inject(ToastrService);
   router = inject(Router);


  readonly loginForm: FormGroup = this.fb.group({
    username:     ['hector@mb.company', Validators.required],
    password:     ['123', Validators.required],
    remember:     [true],
  });

  constructor() {}

  toggleHide() {
    this.hide.update(h => !h);
  }

  toggleMenu() {
    this.menuOpen.update(v => !v);
  }

  onSubmit() {
    if (this.loginForm.invalid) return;
    const { username, password, remember } = this.loginForm.value;


    let data = {
       username,
       password,
    }

    this.authService.login(data).subscribe({
      next: (response) => {
        console.log('Login successful:', response);
        this.toast.success('Login successful', 'Success');
        // Handle successful login here, e.g., redirect to another page
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        console.error('Login failed:', error);
        this.toast.error('Login failed credentials infcorrect.', 'Error', {
          timeOut: 4000,
          progressBar: true,
          closeButton: true,
        });
            this.router.navigate(['/dashboard']);

      },
    });

  }
}

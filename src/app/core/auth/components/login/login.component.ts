import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ExternalAuthService } from '../../services/external-auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  readonly hide = signal(true);
  protected authService = inject(ExternalAuthService);
  protected fb = inject(FormBuilder);
  readonly menuOpen = signal(false);

  readonly loginForm: FormGroup = this.fb.group({
    username:     ['', Validators.required],
    password:     ['', Validators.required],
    remember:     [false],
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

  }
}

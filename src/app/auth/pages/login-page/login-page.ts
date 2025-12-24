import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';

import { AuthService } from '../../services/auth.service';
import { NotificationService } from '../../../core/services/notification.service';
import { finalize } from 'rxjs/operators';

@Component({
  standalone: true,
  selector: 'app-login-page',
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    InputTextModule,
    PasswordModule
  ],
  templateUrl: './login-page.html',
  styleUrl: './login-page.css'
})
export class LoginPage {

  email = '';
  password = '';

  isSubmitting = false;

  constructor(
    private auth: AuthService,
    private router: Router,
    private notification: NotificationService
  ) {}

  login(): void {
    if (this.isSubmitting) return;

    if (!this.email || !this.password) {
      this.notification.showWarn(
        'Ingresa tu correo y contraseña',
        'Formulario incompleto'
      );
      return;
    }

    this.isSubmitting = true;

    this.auth.login({
      email: this.email,
      password: this.password
    })
    .pipe(
      finalize(() => {
        this.isSubmitting = false;
      })
    )
    .subscribe({
      next: () => {
        this.router.navigate(['/spaces']);
      },
      error: (error) => {
        if (error.status === 401) {
          this.notification.showError(
            'Credenciales incorrectas',
            'Acceso denegado'
          );
          return;
        }

        this.notification.showError(
          'No se pudo iniciar sesión',
          'Error'
        );
      }
    });
  }
}

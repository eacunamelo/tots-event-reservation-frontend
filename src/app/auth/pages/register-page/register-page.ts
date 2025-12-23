import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';

import { AuthService } from '../../services/auth.service';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  standalone: true,
  selector: 'app-register-page',
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    InputTextModule,
    PasswordModule
  ],
  templateUrl: './register-page.html',
  styleUrl: './register-page.css'
})
export class RegisterPage {

  name = '';
  email = '';
  password = '';
  confirmPassword = '';

  constructor(
    private auth: AuthService,
    private router: Router,
    private notification: NotificationService
  ) {}

  register(): void {
    if (!this.name || !this.email || !this.password || !this.confirmPassword) {
      this.notification.showWarn(
        'Completa todos los campos',
        'Formulario incompleto'
      );
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.notification.showError(
        'Las contraseñas no coinciden',
        'Validación'
      );
      return;
    }

    this.auth.register({
      name: this.name,
      email: this.email,
      password: this.password,
      password_confirmation: this.confirmPassword
    }).subscribe({
      next: () => {
        this.notification.showSuccess(
          'Cuenta creada correctamente'
        );
        this.router.navigate(['/spaces']);
      },
      error: (error) => {

        if (error.status === 422) {
          this.notification.showError(
            error.error?.message || 'Datos inválidos',
            'Error de validación'
          );
          return;
        }

        this.notification.showError(
          'No se pudo crear la cuenta',
          'Error'
        );
      }
    });
  }
}

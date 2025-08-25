import { Component, signal, inject, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RegisterFormComponent } from '../../components/register-form/register-form';
import { AuthService } from '../../services/auth.service';
import { RegisterRequest } from '../../../../core/models/user.model';

@Component({
  selector: 'app-register-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, RegisterFormComponent],
  templateUrl: './register-page.html',
  styleUrl: './register-page.css'
})
export class RegisterPageComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  loading = signal(false);
  errorMessage = signal<string | null>(null);
  successMessage = signal<string | null>(null);

  async handleRegister(registerData: RegisterRequest): Promise<void> {
    this.loading.set(true);
    this.errorMessage.set(null);
    this.successMessage.set(null);

    try {
      await this.authService.register(registerData);
      this.successMessage.set('Cuenta creada exitosamente. Redirigiendo...');

      // Redirigir después de 2 segundos
      setTimeout(() => {
        this.router.navigate(['/dashboard']);
      }, 2000);
    } catch (error: any) {
      console.error('Error en registro:', error);
      this.errorMessage.set(
        error.message || 'Error al crear la cuenta. Intenta nuevamente.'
      );
    } finally {
      this.loading.set(false);
    }
  }
}

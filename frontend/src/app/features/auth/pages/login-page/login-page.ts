import { Component, signal, inject, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LoginFormComponent } from '../../components/login-form/login-form';
import { AuthService } from '../../services/auth.service';
import { LoginRequest } from '../../../../core/models/user.model';

@Component({
  selector: 'app-login-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, LoginFormComponent],
  templateUrl: './login-page.html',
  styleUrl: './login-page.css'
})
export class LoginPageComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  loading = signal(false);
  errorMessage = signal<string | null>(null);

  async handleLogin(loginData: LoginRequest): Promise<void> {
    this.loading.set(true);
    this.errorMessage.set(null);

    try {
      await this.authService.login(loginData);
      this.router.navigate(['/dashboard']);
    } catch (error: any) {
      console.error('Error en login:', error);
      this.errorMessage.set(
        error.message || 'Error al iniciar sesión. Verifica tus credenciales.'
      );
    } finally {
      this.loading.set(false);
    }
  }
}

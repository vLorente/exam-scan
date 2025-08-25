import { Component, signal, inject, ChangeDetectionStrategy } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { firstValueFrom } from 'rxjs';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { LoginFormComponent } from '../../components/login-form/login-form';
import { AuthService } from '../../services/auth.service';
import { LoginRequest } from '../../../../core/models/user.model';

@Component({
  selector: 'app-login-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    LoginFormComponent,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    RouterLink
  ],
  templateUrl: './login-page.html',
  styleUrl: './login-page.css'
})
export class LoginPageComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  loading = signal(false);

  async handleLogin(loginData: LoginRequest): Promise<void> {
    this.loading.set(true);

    try {
      const response = await firstValueFrom(this.authService.login(loginData));
      this.authService.setSession(response);

      this.snackBar.open('¡Bienvenido! Inicio de sesión exitoso', 'Cerrar', {
        duration: 3000,
        panelClass: ['success-snackbar']
      });

      this.router.navigate(['/dashboard']);
    } catch (error: any) {
      console.error('Error en login:', error);

      this.snackBar.open(
        error.message || 'Error al iniciar sesión. Verifica tus credenciales.',
        'Cerrar',
        {
          duration: 5000,
          panelClass: ['error-snackbar']
        }
      );
    } finally {
      this.loading.set(false);
    }
  }
}

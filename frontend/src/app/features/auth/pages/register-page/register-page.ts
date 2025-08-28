import { Component, signal, inject, ChangeDetectionStrategy } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { firstValueFrom } from 'rxjs';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { RegisterFormComponent } from '../../components/register-form/register-form';
import { AuthService } from '../../../../core/services/auth';
import { RegisterRequest } from '../../../../core/models/user.model';

@Component({
  selector: 'app-register-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    RegisterFormComponent,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    RouterLink
  ],
  templateUrl: './register-page.html',
  styleUrl: './register-page.css'
})
export class RegisterPageComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  loading = signal(false);

  async handleRegister(registerData: RegisterRequest): Promise<void> {
    this.loading.set(true);

    try {
      const response = await firstValueFrom(this.authService.register(registerData));
      this.authService.setSession(response);

      this.snackBar.open('¡Cuenta creada exitosamente! Bienvenido', 'Cerrar', {
        duration: 3000,
        panelClass: ['success-snackbar']
      });

      this.router.navigate(['/dashboard']);
    } catch (error: any) {
      console.error('Error en registro:', error);

      this.snackBar.open(
        error.message || 'Error al crear la cuenta. Verifica los datos e intenta nuevamente.',
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

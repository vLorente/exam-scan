import { Component, input, output, ChangeDetectionStrategy, OnInit, OnDestroy, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { User } from '@core/models/user.model';
import { AuthService } from '@core/services/auth';

@Component({
  selector: 'app-header',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class HeaderComponent implements OnInit, OnDestroy {
  private authService = inject(AuthService);
  private router = inject(Router);

  // El header obtiene directamente la información del usuario
  user = this.authService.user;

  title = input<string>('ExamScan');
  subtitle = input<string>('Dashboard');

  // Output opcional para notificar que se hizo logout (para casos especiales)
  logout = output<void>();

  isScrolled = signal(false);

  ngOnInit(): void {
    this.addScrollListener();
  }

  ngOnDestroy(): void {
    this.removeScrollListener();
  }

  private addScrollListener(): void {
    window.addEventListener('scroll', this.handleScroll, { passive: true });
  }

  private removeScrollListener(): void {
    window.removeEventListener('scroll', this.handleScroll);
  }

  private handleScroll = (): void => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    this.isScrolled.set(scrollTop > 10);
  };

  getRoleLabel(role: string): string {
    const labels = {
      'admin': 'Administrador',
      'teacher': 'Profesor',
      'student': 'Estudiante'
    };
    return labels[role as keyof typeof labels] || role;
  }

  getRoleLetter(role: string): string {
    const letters = {
      'admin': 'A',
      'teacher': 'P',
      'student': 'E'
    };
    return letters[role as keyof typeof letters] || role.charAt(0).toUpperCase();
  }

  onLogout(): void {
    // Ejecutar logout internamente
    this.authService.logout();
    this.router.navigate(['/login']);

    // Emitir evento para casos especiales donde la página padre necesite saberlo
    this.logout.emit();
  }
}

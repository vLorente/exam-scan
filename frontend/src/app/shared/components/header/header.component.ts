import { Component, input, output, ChangeDetectionStrategy, OnInit, OnDestroy, signal, inject, computed, Type } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { User } from '@core/models/user.model';
import { AuthService } from '@core/services/auth';
import { DocumentIconComponent } from '@shared/components/icons';

export interface NavigationItem {
  label: string;
  route: string;
  iconComponent: Type<any>;
  ariaLabel: string;
  description: string;
  roles?: string[]; // Roles que pueden ver este item (opcional)
}

@Component({
  selector: 'app-header',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, DocumentIconComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
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

  // Navigation items configuration
  private navigationItems: NavigationItem[] = [
    {
      label: 'Exámenes',
      route: '/exams',
      iconComponent: DocumentIconComponent,
      ariaLabel: 'Ir a la página de exámenes',
      description: 'Acceder a la gestión de exámenes'
    }
    // Ejemplo de cómo añadir más items de navegación:
    // {
    //   label: 'Usuarios',
    //   route: '/users',
    //   iconComponent: UsersIconComponent,
    //   ariaLabel: 'Ir a la gestión de usuarios',
    //   description: 'Acceder a la administración de usuarios',
    //   roles: ['admin'] // Solo administradores pueden ver este item
    // },
    // {
    //   label: 'Estadísticas',
    //   route: '/stats',
    //   iconComponent: BarChartIconComponent,
    //   ariaLabel: 'Ver estadísticas',
    //   description: 'Acceder a las estadísticas del sistema',
    //   roles: ['admin', 'teacher'] // Admin y profesores pueden ver estadísticas
    // }
  ];

  // Computed property para obtener los items de navegación filtrados por rol
  visibleNavigationItems = computed(() => {
    const currentUser = this.user();
    if (!currentUser) return [];

    return this.navigationItems.filter(item => {
      // Si no se especifican roles, el item es visible para todos
      if (!item.roles || item.roles.length === 0) return true;
      // Si se especifican roles, verificar que el usuario tenga uno de esos roles
      return item.roles.includes(currentUser.role);
    });
  });

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
    this.isScrolled.set(scrollTop > 20);
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

  navigateToDashboard(): void {
    this.router.navigate(['/dashboard']);
  }

  navigateToExams(): void {
    this.router.navigate(['/exams']);
  }

  navigateToRoute(route: string): void {
    this.router.navigate([route]);
  }
}

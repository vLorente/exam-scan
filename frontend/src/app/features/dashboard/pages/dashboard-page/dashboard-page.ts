import { Component, inject, computed, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '@core/services/auth';
import { HeaderComponent, FooterComponent } from '@shared/components';
import { DashboardCardComponent } from '../../components/dashboard-card/dashboard-card';

interface DashboardCard {
  id: string;
  title: string;
  description: string;
  buttonText: string;
  icon: string;
  routerLink?: string;
  disabled?: boolean;
  buttonClass?: string;
  requiresRole?: string[];
}

interface DashboardStat {
  value: string;
  label: string;
  ariaLabel: string;
}

@Component({
  selector: 'app-dashboard-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, HeaderComponent, FooterComponent, DashboardCardComponent],
  templateUrl: './dashboard-page.html',
  styleUrl: './dashboard-page.css'
})
export class DashboardPageComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  currentUser = this.authService.user;

  private allCards = signal<DashboardCard[]>([
    {
      id: 'exams',
      title: 'Exámenes',
      description: 'Gestiona tus exámenes, crea nuevos o revisa los existentes.',
      buttonText: 'Ver Exámenes',
      icon: 'quiz',
      routerLink: '/exams'
    },
    {
      id: 'ai-processing',
      title: 'Procesamiento IA',
      description: 'Sube archivos PDF para extraer preguntas automáticamente.',
      buttonText: 'Próximamente',
      icon: 'smart_toy',
      disabled: true,
      buttonClass: 'btn-secondary'
    },
    {
      id: 'users',
      title: 'Usuarios',
      description: 'Administra usuarios y permisos del sistema.',
      buttonText: 'Gestionar Usuarios',
      icon: 'people',
      routerLink: '/users',
      requiresRole: ['admin']
    },
    {
      id: 'statistics',
      title: 'Estadísticas',
      description: 'Revisa el rendimiento y estadísticas de exámenes.',
      buttonText: 'Próximamente',
      icon: 'analytics',
      disabled: true,
      buttonClass: 'btn-secondary'
    }
  ]);

  dashboardCards = computed(() => {
    const user = this.currentUser();
    if (!user) return [];

    return this.allCards().filter(card => {
      if (!card.requiresRole) return true;
      return card.requiresRole.includes(user.role);
    });
  });

  dashboardStats = computed((): DashboardStat[] => {
    const user = this.currentUser();
    if (!user) return [];

    // Base stats for all users
    const baseStats: DashboardStat[] = [
      {
        value: '12',
        label: 'Exámenes Creados',
        ariaLabel: 'Doce exámenes creados'
      },
      {
        value: '89%',
        label: 'Tasa de Éxito',
        ariaLabel: 'Ochenta y nueve por ciento de tasa de éxito'
      },
      {
        value: '247',
        label: 'Estudiantes',
        ariaLabel: 'Doscientos cuarenta y siete estudiantes'
      }
    ];

    // Admin-specific stats
    if (user.role === 'admin') {
      return [
        ...baseStats,
        {
          value: '24/7',
          label: 'Disponibilidad',
          ariaLabel: 'Veinticuatro horas al día, siete días a la semana de disponibilidad'
        }
      ];
    }

    return baseStats;
  });

  handleLogout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  handleCardAction(cardId: string): void {
    // Handle custom card actions if needed
    console.log(`Card action triggered: ${cardId}`);
  }
}

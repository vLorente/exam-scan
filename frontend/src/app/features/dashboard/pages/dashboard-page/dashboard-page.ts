import { Component, inject, computed, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../../auth/services/auth.service';
import { DashboardHeaderComponent } from '../../components/dashboard-header/dashboard-header';
import { DashboardCardComponent } from '../../components/dashboard-card/dashboard-card';

interface DashboardCard {
  id: string;
  title: string;
  description: string;
  buttonText: string;
  routerLink?: string;
  disabled?: boolean;
  buttonClass?: string;
  requiresRole?: string[];
}

@Component({
  selector: 'app-dashboard-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, DashboardHeaderComponent, DashboardCardComponent],
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
      routerLink: '/exams'
    },
    {
      id: 'ai-processing',
      title: 'Procesamiento IA',
      description: 'Sube archivos PDF para extraer preguntas automáticamente.',
      buttonText: 'Próximamente',
      disabled: true,
      buttonClass: 'btn-secondary'
    },
    {
      id: 'users',
      title: 'Usuarios',
      description: 'Administra usuarios y permisos del sistema.',
      buttonText: 'Gestionar Usuarios',
      routerLink: '/users',
      requiresRole: ['admin']
    },
    {
      id: 'statistics',
      title: 'Estadísticas',
      description: 'Revisa el rendimiento y estadísticas de exámenes.',
      buttonText: 'Próximamente',
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

  handleLogout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  handleCardAction(cardId: string): void {
    // Handle custom card actions if needed
    console.log(`Card action triggered: ${cardId}`);
  }
}

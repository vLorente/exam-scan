import { Component, inject, computed, signal, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '@core/services/auth';
import { LayoutComponent } from '@shared/components';
import { DashboardCardComponent } from '../../components/dashboard-card/dashboard-card.component';
import { ExamsService } from '@features/exams/services';

interface DashboardCard {
  id: string;
  title: string;
  description: string;
  buttonText: string;
  icon: string;
  routerLink?: string;
  disabled?: boolean;
  buttonClass?: string;
  stats?: string; // New field for displaying stats in the card
}

interface DashboardStat {
  value: string;
  label: string;
  ariaLabel: string;
}

@Component({
  selector: 'app-dashboard-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, LayoutComponent, DashboardCardComponent],
  templateUrl: './dashboard.page.html',
  styleUrl: './dashboard.page.css'
})
export class DashboardPageComponent implements OnInit {
  private authService = inject(AuthService);
  private examsService = inject(ExamsService);

  // Signals for exam statistics
  private examStats = signal<{totalExams: number, totalQuestions: number} | null>(null);

  ngOnInit(): void {
    this.loadExamStats();
  }

  private loadExamStats(): void {
    this.examsService.getExamStats().subscribe(stats => {
      this.examStats.set({
        totalExams: stats.totalExams,
        totalQuestions: stats.totalQuestions
      });
    });
  }

  private allCards = computed<DashboardCard[]>(() => {
    const stats = this.examStats();
    const statsText = stats
      ? `${stats.totalExams} exámenes • ${stats.totalQuestions} preguntas`
      : 'Cargando estadísticas...';

    return [
      {
        id: 'exams',
        title: 'Mis Exámenes',
        description: 'Accede a tus exámenes asignados y revisa tus calificaciones.',
        buttonText: 'Ver Exámenes',
        icon: 'quiz',
        routerLink: '/exams',
        stats: statsText
      },
      {
        id: 'practice',
        title: 'Modo Práctica',
        description: 'Practica con exámenes de muestra y mejora tus habilidades.',
        buttonText: 'Próximamente',
        icon: 'fitness',
        disabled: true,
        buttonClass: 'btn-secondary'
      },
      {
        id: 'results',
        title: 'Mis Resultados',
        description: 'Revisa tu historial de exámenes y progreso académico.',
        buttonText: 'Próximamente',
        icon: 'analytics',
        disabled: true,
        buttonClass: 'btn-secondary'
      },
      {
        id: 'study-materials',
        title: 'Material de Estudio',
        description: 'Accede a recursos y materiales de estudio complementarios.',
        buttonText: 'Próximamente',
        icon: 'menu_book',
        disabled: true,
        buttonClass: 'btn-secondary'
      }
    ];
  });

  dashboardCards = computed(() => {
    // Return all cards since we're focused on student functionality
    return this.allCards();
  });

  dashboardStats = computed((): DashboardStat[] => {
    const user = this.authService.user();
    if (!user) return [];

    // Student-focused statistics
    const studentStats: DashboardStat[] = [
      {
        value: '5',
        label: 'Exámenes Completados',
        ariaLabel: 'Cinco exámenes completados'
      },
      {
        value: '85%',
        label: 'Promedio General',
        ariaLabel: 'Ochenta y cinco por ciento de promedio general'
      },
      {
        value: '3',
        label: 'Exámenes Pendientes',
        ariaLabel: 'Tres exámenes pendientes'
      },
      {
        value: '24',
        label: 'Días de Racha',
        ariaLabel: 'Veinticuatro días de racha de estudio'
      }
    ];

    return studentStats;
  });

  handleCardAction(cardId: string): void {
    // Handle custom card actions if needed
    console.log(`Card action triggered: ${cardId}`);
  }
}

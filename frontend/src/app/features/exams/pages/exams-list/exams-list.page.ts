import { Component, inject, signal, computed, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { LayoutComponent } from '@shared/components';
import { ExamsService } from '../../services';
import { Exam } from '@core/models';

@Component({
  selector: 'app-exams-list-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, LayoutComponent],
  templateUrl: './exams-list.page.html',
  styleUrl: './exams-list.page.css'
})
export class ExamsListPageComponent implements OnInit {
  private examsService = inject(ExamsService);
  private router = inject(Router);

  exams = signal<Exam[]>([]);
  loading = signal<boolean>(true);
  error = signal<string | null>(null);

  // Computed properties for template calculations
  activeExamsCount = computed(() => this.exams().filter(e => e.isActive).length);
  totalQuestions = computed(() => this.exams().reduce((sum, exam) => sum + exam.totalQuestions, 0));

  ngOnInit(): void {
    this.loadExams();
  }

  private loadExams(): void {
    this.loading.set(true);
    this.error.set(null);

    this.examsService.getExams().subscribe({
      next: (exams) => {
        this.exams.set(exams);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error loading exams:', error);
        this.error.set('Error al cargar los exámenes. Por favor, intenta de nuevo.');
        this.loading.set(false);
      }
    });
  }

  onExamClick(exam: Exam): void {
    // Navigate to exam detail or take exam page
    console.log('Navigate to exam:', exam.id);
    // this.router.navigate(['/exams', exam.id]);
  }

  onRetry(): void {
    this.loadExams();
  }

  getExamStatusClass(exam: Exam): string {
    return exam.isActive ? 'status-active' : 'status-inactive';
  }

  getExamStatusText(exam: Exam): string {
    return exam.isActive ? 'Disponible' : 'No disponible';
  }

  formatDuration(minutes?: number): string {
    if (!minutes) return 'Sin límite';

    if (minutes < 60) {
      return `${minutes} min`;
    }

    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;

    if (remainingMinutes === 0) {
      return `${hours}h`;
    }

    return `${hours}h ${remainingMinutes}min`;
  }
}

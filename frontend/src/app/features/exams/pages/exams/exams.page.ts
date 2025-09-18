import { Component, inject, signal, computed, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { LayoutComponent } from '@shared/components';
import { ExamsService } from '@features/exams/services/exams.service';
import { ExamCardComponent, ExamListItemComponent, CreateExamCtaComponent } from '@features/exams/components';
import { Exam } from '@core/models';

type ViewMode = 'grid' | 'list';

@Component({
  selector: 'app-exams-list-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, LayoutComponent, ExamCardComponent, ExamListItemComponent, CreateExamCtaComponent],
  templateUrl: './exams.page.html',
  styleUrl: './exams.page.css'
})
export class ExamsListPageComponent implements OnInit {
  private examsService = inject(ExamsService);
  private router = inject(Router);

  exams = signal<Exam[]>([]);
  loading = signal<boolean>(true);
  error = signal<string | null>(null);
  viewMode = signal<ViewMode>('grid'); // Default to grid view

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

  onToggleViewMode(): void {
    this.viewMode.set(this.viewMode() === 'grid' ? 'list' : 'grid');
  }

  getViewModeIcon(): string {
    return this.viewMode() === 'grid' ? 'M4 6h16v2H4zm0 5h16v2H4zm0 5h16v2H4z' : 'M3 3h7v7H3zm11 0h7v7h-7zm0 11h7v7h-7zM3 14h7v7H3z';
  }

  getViewModeLabel(): string {
    return this.viewMode() === 'grid' ? 'Vista de Lista' : 'Vista de Cuadrícula';
  }
}

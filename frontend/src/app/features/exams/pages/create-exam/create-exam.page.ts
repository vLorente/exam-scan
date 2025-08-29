import { Component, ChangeDetectionStrategy, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HeaderComponent } from '@shared/components/header/header.component';
import { LayoutComponent } from '@shared/components/layout/layout.component';
import { ExamsService } from '../../services/exams.service';
import { CreateExamRequest } from '@core/models';

type CreationMode = 'selection' | 'manual' | 'pdf';

@Component({
  selector: 'app-create-exam',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    LayoutComponent
  ],
  templateUrl: './create-exam.page.html',
  styleUrl: './create-exam.page.css'
})
export class CreateExamPageComponent {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private examsService = inject(ExamsService);

  currentMode = signal<CreationMode>('selection');
  isSubmitting = signal(false);

  examForm: FormGroup;

  constructor() {
    this.examForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: [''],
      timeLimit: [60, [Validators.min(1), Validators.max(300)]],
      passingScore: [70, [Validators.required, Validators.min(1), Validators.max(100)]]
    });
  }

  selectMode(mode: CreationMode): void {
    this.currentMode.set(mode);
  }

  goBack(): void {
    if (this.currentMode() === 'selection') {
      this.router.navigate(['/exams']);
    } else {
      this.currentMode.set('selection');
    }
  }

  async onSubmit(): Promise<void> {
    if (this.examForm.invalid) {
      this.markFormGroupTouched();
      return;
    }

    this.isSubmitting.set(true);

    try {
      const formValue = this.examForm.value;
      const createRequest: CreateExamRequest = {
        title: formValue.title,
        description: formValue.description || undefined,
        timeLimit: formValue.timeLimit || undefined,
        passingScore: formValue.passingScore
      };

      const exam = await this.examsService.createExam(createRequest).toPromise();

      if (exam) {
        // Navigate to questions creation page
        this.router.navigate(['/exams', exam.id, 'questions']);
      }
    } catch (error) {
      console.error('Error creating exam:', error);
      // TODO: Show error message to user
    } finally {
      this.isSubmitting.set(false);
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.examForm.controls).forEach(key => {
      const control = this.examForm.get(key);
      control?.markAsTouched();
    });
  }
}

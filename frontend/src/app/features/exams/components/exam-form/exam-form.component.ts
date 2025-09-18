import { Component, ChangeDetectionStrategy, input, output, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { SubmitButtonComponent } from '@shared/components/submit-button/submit-button.component';
import { CreateExamRequest } from '@core/models';

@Component({
  selector: 'app-exam-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatProgressSpinnerModule,
    SubmitButtonComponent
  ],
  templateUrl: './exam-form.component.html',
  styleUrl: './exam-form.component.css'
})
export class ExamFormComponent implements OnInit {
  // Inputs
  initialData = input<Partial<CreateExamRequest>>();
  submitButtonText = input('Crear Examen');
  submitLoadingText = input('Creando...');
  showSubmitButton = input(true);
  isSubmitting = input(false);

  // Outputs
  formSubmit = output<CreateExamRequest>();

  examForm!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.createForm();

    // Set initial data if provided
    const initial = this.initialData();
    if (initial) {
      this.examForm.patchValue(initial);
    }
  }

  private createForm(): void {
    this.examForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: [''],
      timeLimit: [60, [Validators.min(1), Validators.max(300)]],
      passingScore: [70, [Validators.required, Validators.min(1), Validators.max(100)]]
    });
  }

  onSubmit(): void {
    if (this.examForm.invalid) {
      this.markFormGroupTouched();
      return;
    }

    const formValue = this.examForm.value;
    const examData: CreateExamRequest = {
      title: formValue.title,
      description: formValue.description || undefined,
      timeLimit: formValue.timeLimit || undefined,
      passingScore: formValue.passingScore
    };

    this.formSubmit.emit(examData);
  }

  private markFormGroupTouched(): void {
    Object.keys(this.examForm.controls).forEach(key => {
      const control = this.examForm.get(key);
      control?.markAsTouched();
    });
  }

  // Public method to reset form
  resetForm(): void {
    this.examForm.reset({
      title: '',
      description: '',
      timeLimit: 60,
      passingScore: 70
    });
  }

  // Public method to update form data
  updateFormData(data: Partial<CreateExamRequest>): void {
    this.examForm.patchValue(data);
  }
}

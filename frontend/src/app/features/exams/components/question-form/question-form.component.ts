import { Component, ChangeDetectionStrategy, input, output, signal, OnInit, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule, FormControl } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatRadioModule } from '@angular/material/radio';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { SubmitButtonComponent } from '@shared/components/submit-button/submit-button.component';
import { CreateQuestionRequest, QuestionType } from '@core/models';

@Component({
  selector: 'app-question-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatRadioModule,
    MatProgressSpinnerModule,
    MatDividerModule,
    SubmitButtonComponent
  ],
  templateUrl: './question-form.component.html',
  styleUrl: './question-form.component.css'
})
export class QuestionFormComponent implements OnInit {
  // Inputs
  examId = input.required<number>();
  editingQuestion = input<CreateQuestionRequest | null>(null);
  isSubmitting = input(false);

  // Outputs
  questionSubmit = output<CreateQuestionRequest>();
  cancelEdit = output<void>();

  // State
  editingMode = signal(false);
  correctAnswerIndex = signal(0);

  questionForm!: FormGroup;

  private fb = inject(FormBuilder);

  get optionsArray(): FormArray {
    return this.questionForm.get('options') as FormArray;
  }

  // Computed property to get FormControls from FormArray
  optionsControls = computed(() => {
    return this.optionsArray.controls as FormControl[];
  });

  ngOnInit(): void {
    this.createForm();

    // Check if we're editing an existing question
    const question = this.editingQuestion();
    if (question) {
      this.editingMode.set(true);
      this.loadQuestionData(question);
    }
  }

  private createForm(): void {
    this.questionForm = this.fb.group({
      questionText: ['', [Validators.required, Validators.minLength(10)]],
      questionType: ['multiple_choice' as QuestionType, Validators.required],
      difficulty: ['medium', Validators.required],
      points: [5, [Validators.required, Validators.min(1), Validators.max(100)]],
      options: this.fb.array([
        this.fb.control('', Validators.required),
        this.fb.control('', Validators.required)
      ]),
      correctAnswer: ['']
    });
  }

  private loadQuestionData(question: CreateQuestionRequest): void {
    this.questionForm.patchValue({
      questionText: question.questionText,
      questionType: question.questionType,
      difficulty: question.difficulty,
      points: question.points,
      correctAnswer: question.questionType !== 'multiple_choice' && question.questionType !== 'single_choice' ? question.correctAnswer : ''
    });

    if ((question.questionType === 'multiple_choice' || question.questionType === 'single_choice') && question.options) {
      this.resetOptionsArray();
      question.options.forEach((option, i) => {
        if (i >= this.optionsArray.length) {
          this.addOption();
        }
        this.optionsArray.at(i)?.setValue(option);
        if (option === question.correctAnswer) {
          this.correctAnswerIndex.set(i);
        }
      });
    }
  }

  onTypeChange(): void {
    const type = this.questionForm.get('questionType')?.value;

    if (type === 'multiple_choice' || type === 'single_choice') {
      this.resetOptionsArray();
      this.questionForm.get('correctAnswer')?.setValue('');
      this.correctAnswerIndex.set(0);
    } else if (type === 'true_false') {
      this.questionForm.get('correctAnswer')?.setValue(true);
    }
  }

  private resetOptionsArray(): void {
    const optionsArray = this.optionsArray;
    optionsArray.clear();
    optionsArray.push(this.fb.control('', Validators.required));
    optionsArray.push(this.fb.control('', Validators.required));
  }

  addOption(): void {
    if (this.optionsArray.length < 6) {
      this.optionsArray.push(this.fb.control('', Validators.required));
    }
  }

  removeOption(index: number): void {
    if (this.optionsArray.length > 2) {
      this.optionsArray.removeAt(index);
      // Adjust correct answer index if needed
      if (this.correctAnswerIndex() >= this.optionsArray.length) {
        this.correctAnswerIndex.set(0);
      }
    }
  }

  setCorrectAnswer(index: number): void {
    this.correctAnswerIndex.set(index);
  }

  onSubmit(): void {
    if (this.questionForm.invalid) {
      this.markFormGroupTouched();
      return;
    }

    const formValue = this.questionForm.value;
    let correctAnswer: string | boolean;
    let options: string[] | undefined;

    if (formValue.questionType === 'multiple_choice' || formValue.questionType === 'single_choice') {
      options = formValue.options.filter((option: string) => option.trim());
      correctAnswer = options?.[this.correctAnswerIndex()] || '';
    } else {
      correctAnswer = formValue.correctAnswer;
    }

    const question: CreateQuestionRequest = {
      examId: this.examId(),
      questionText: formValue.questionText,
      questionType: formValue.questionType,
      difficulty: formValue.difficulty,
      options,
      correctAnswer,
      points: formValue.points,
      orderIndex: 0 // Will be set by the parent component
    };

    this.questionSubmit.emit(question);

    // Reset form if not editing
    if (!this.editingMode()) {
      this.resetForm();
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.questionForm.controls).forEach(key => {
      const control = this.questionForm.get(key);
      control?.markAsTouched();
    });

    this.optionsArray.controls.forEach(control => {
      control.markAsTouched();
    });
  }

  private resetForm(): void {
    this.questionForm.reset({
      questionText: '',
      questionType: 'multiple_choice',
      difficulty: 'medium',
      points: 5,
      correctAnswer: ''
    });
    this.resetOptionsArray();
    this.correctAnswerIndex.set(0);
  }
}

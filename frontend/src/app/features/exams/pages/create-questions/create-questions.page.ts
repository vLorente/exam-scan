import { Component, ChangeDetectionStrategy, signal, computed, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { LayoutComponent } from '@shared/components/layout/layout.component';
import { ExamsService } from '../../services/exams.service';
import { CreateQuestionRequest, QuestionType, Exam } from '@core/models';

@Component({
  selector: 'app-create-questions',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    LayoutComponent
  ],
  templateUrl: './create-questions.page.html',
  styleUrl: './create-questions.page.css'
})
export class CreateQuestionsPageComponent implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private examsService = inject(ExamsService);

  exam = signal<Exam | null>(null);
  questions = signal<CreateQuestionRequest[]>([]);
  editingIndex = signal(-1);
  correctAnswerIndex = signal(0);

  questionForm: FormGroup;

  totalPoints = computed(() =>
    this.questions().reduce((total, q) => total + q.points, 0)
  );

  constructor() {
    this.questionForm = this.createQuestionForm();
  }

  get optionsArray(): FormArray {
    return this.questionForm.get('options') as FormArray;
  }

  ngOnInit(): void {
    const examId = this.route.snapshot.paramMap.get('id');
    if (examId) {
      this.loadExam(+examId);
    }
  }

  private loadExam(id: number): void {
    this.examsService.getExamById(id).subscribe(exam => {
      if (exam) {
        this.exam.set(exam);
      } else {
        this.router.navigate(['/exams']);
      }
    });
  }

  private createQuestionForm(): FormGroup {
    return this.fb.group({
      questionText: ['', [Validators.required, Validators.minLength(10)]],
      questionType: ['multiple_choice' as QuestionType, Validators.required],
      points: [5, [Validators.required, Validators.min(1), Validators.max(100)]],
      options: this.fb.array([
        this.fb.control('', Validators.required),
        this.fb.control('', Validators.required)
      ]),
      correctAnswer: ['']
    });
  }

  onTypeChange(): void {
    const type = this.questionForm.get('questionType')?.value;

    if (type === 'multiple_choice') {
      this.resetOptionsArray();
      this.questionForm.get('correctAnswer')?.setValue('');
      this.correctAnswerIndex.set(0);
    } else if (type === 'true_false') {
      this.questionForm.get('correctAnswer')?.setValue(true);
    } else {
      this.questionForm.get('correctAnswer')?.setValue('');
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

  onSubmitQuestion(): void {
    if (this.questionForm.invalid) {
      this.markFormGroupTouched();
      return;
    }

    const formValue = this.questionForm.value;
    const examData = this.exam();
    if (!examData) return;

    let correctAnswer: string | boolean;
    let options: string[] | undefined;

    if (formValue.questionType === 'multiple_choice') {
      options = formValue.options.filter((option: string) => option.trim());
      correctAnswer = options?.[this.correctAnswerIndex()] || '';
    } else {
      correctAnswer = formValue.correctAnswer;
    }

    const question: CreateQuestionRequest = {
      examId: examData.id,
      questionText: formValue.questionText,
      questionType: formValue.questionType,
      options,
      correctAnswer,
      points: formValue.points,
      orderIndex: this.editingIndex() !== -1 ? this.editingIndex() : this.questions().length
    };

    if (this.editingIndex() !== -1) {
      // Update existing question
      this.questions.update(questions => {
        const updated = [...questions];
        updated[this.editingIndex()] = question;
        return updated;
      });
      this.editingIndex.set(-1);
    } else {
      // Add new question
      this.questions.update(questions => [...questions, question]);
    }

    this.resetForm();
  }

  editQuestion(index: number): void {
    const question = this.questions()[index];
    this.editingIndex.set(index);

    this.questionForm.patchValue({
      questionText: question.questionText,
      questionType: question.questionType,
      points: question.points,
      correctAnswer: question.questionType !== 'multiple_choice' ? question.correctAnswer : ''
    });

    if (question.questionType === 'multiple_choice' && question.options) {
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

  deleteQuestion(index: number): void {
    if (confirm('¿Estás seguro de que quieres eliminar esta pregunta?')) {
      this.questions.update(questions => questions.filter((_, i) => i !== index));

      // Reset editing if we were editing this question
      if (this.editingIndex() === index) {
        this.cancelEdit();
      }
    }
  }

  cancelEdit(): void {
    this.editingIndex.set(-1);
    this.resetForm();
  }

  private resetForm(): void {
    this.questionForm.reset({
      questionText: '',
      questionType: 'multiple_choice',
      points: 5,
      correctAnswer: ''
    });
    this.resetOptionsArray();
    this.correctAnswerIndex.set(0);
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

  getTypeLabel(type: QuestionType): string {
    const labels = {
      'multiple_choice': 'Opción Múltiple',
      'true_false': 'V/F',
      'short_answer': 'Respuesta Corta'
    };
    return labels[type];
  }

  finishExam(): void {
    if (this.questions().length === 0) {
      alert('Debes añadir al menos una pregunta al examen.');
      return;
    }

    // TODO: Save questions to the backend
    // For now, just navigate back to exams list
    this.router.navigate(['/exams']);
  }

  goBack(): void {
    this.router.navigate(['/exams']);
  }
}

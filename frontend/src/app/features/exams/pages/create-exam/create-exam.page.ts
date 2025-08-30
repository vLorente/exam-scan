import { Component, ChangeDetectionStrategy, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { LayoutComponent } from '@shared/components/layout/layout.component';
import { DragDropUploadComponent } from '@shared/components/drag-drop-upload/drag-drop-upload.component';
import { PageTitleComponent } from '@shared/components/page-title/page-title.component';
import { ExamFormComponent } from '@features/exams/components/exam-form/exam-form.component';
import { QuestionFormComponent } from '@features/exams/components/question-form/question-form.component';
import { QuestionListComponent } from '@features/exams/components/question-list/question-list.component';
import { ExamSummaryComponent } from '@features/exams/components/exam-summary/exam-summary';
import { ExamsService } from '@features/exams/services/exams.service';
import { CreateExamRequest, CreateQuestionRequest, Exam } from '@core/models';

@Component({
  selector: 'app-create-exam',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    LayoutComponent,
    DragDropUploadComponent,
    PageTitleComponent,
    ExamFormComponent,
    QuestionFormComponent,
    QuestionListComponent,
    ExamSummaryComponent
  ],
  templateUrl: './create-exam.page.html',
  styleUrl: './create-exam.page.css'
})
export class CreateExamPageComponent {
  private router = inject(Router);
  private examsService = inject(ExamsService);

  // State
  examData = signal<Exam | null>(null);
  questions = signal<CreateQuestionRequest[]>([]);
  editingQuestionIndex = signal(-1);
  isSubmitting = signal(false);
  isSubmittingQuestion = signal(false);
  pdfProcessingData = signal<any>(null);
  isEditingExam = signal(false);

  // Computed
  editingQuestion = computed(() => {
    const index = this.editingQuestionIndex();
    return index >= 0 ? this.questions()[index] : null;
  });

  totalPoints = computed(() =>
    this.questions().reduce((total, q) => total + q.points, 0)
  );

  canFinishExam = computed(() =>
    this.examData() !== null && this.questions().length > 0
  );

  // PDF Upload Handlers
  onPdfSelected(file: File): void {
    console.log('PDF selected:', file.name);
    // Here you would implement the actual PDF processing
  }

  onPdfProcessingComplete(data: any): void {
    this.pdfProcessingData.set(data);
    console.log('PDF processing complete:', data);

    // You could extract exam data and questions from the PDF here
    // For now, we'll just show a placeholder
  }

  onPdfRemoved(): void {
    this.pdfProcessingData.set(null);
  }

  // Exam Form Handlers
  async onExamFormSubmit(examData: CreateExamRequest): Promise<void> {
    this.isSubmitting.set(true);

    try {
      // Create the exam in the database
      const exam = await this.examsService.createExam(examData).toPromise();

      if (exam) {
        // Store the created exam (which has an id)
        this.examData.set(exam);
      }
    } catch (error) {
      console.error('Error creating exam:', error);
      alert('Error al crear el examen. Por favor, inténtalo de nuevo.');
    } finally {
      this.isSubmitting.set(false);
    }
  }

  // Exam Summary Handlers
  onEditExam(): void {
    this.isEditingExam.set(true);
  }

  onContinueToQuestions(): void {
    // The exam is already created, just proceed to questions section
    // This method is called when user clicks "Continue to Questions" from summary
  }

  // Exam Form Edit Handlers
  async onExamFormEditSubmit(examData: CreateExamRequest): Promise<void> {
    const currentExam = this.examData();
    if (!currentExam) return;

    this.isSubmitting.set(true);

    try {
      // Update the exam in the database
      const updatedExam = await this.examsService.updateExam(currentExam.id, examData).toPromise();

      if (updatedExam) {
        // Update the stored exam data
        this.examData.set(updatedExam);
        this.isEditingExam.set(false);
      }
    } catch (error) {
      console.error('Error updating exam:', error);
      alert('Error al actualizar el examen. Por favor, inténtalo de nuevo.');
    } finally {
      this.isSubmitting.set(false);
    }
  }

  // Question Form Handlers
  onQuestionSubmit(question: CreateQuestionRequest): void {
    const exam = this.examData();
    if (!exam) return;

    const questionWithExamId = {
      ...question,
      examId: exam.id, // Now we have the real exam id
      orderIndex: this.editingQuestionIndex() !== -1
        ? this.editingQuestionIndex()
        : this.questions().length
    };

    if (this.editingQuestionIndex() !== -1) {
      // Update existing question
      this.questions.update(questions => {
        const updated = [...questions];
        updated[this.editingQuestionIndex()] = questionWithExamId;
        return updated;
      });
      this.editingQuestionIndex.set(-1);
    } else {
      // Add new question
      this.questions.update(questions => [...questions, questionWithExamId]);
    }
  }

  onQuestionEditCancel(): void {
    this.editingQuestionIndex.set(-1);
  }

  // Question List Handlers
  onEditQuestion(index: number): void {
    this.editingQuestionIndex.set(index);
  }

  onDeleteQuestion(index: number): void {
    if (confirm('¿Estás seguro de que quieres eliminar esta pregunta?')) {
      this.questions.update(questions => questions.filter((_, i) => i !== index));

      // Reset editing if we were editing this question
      if (this.editingQuestionIndex() === index) {
        this.editingQuestionIndex.set(-1);
      }
    }
  }

  // Final submission
  async finishExam(): Promise<void> {
    const exam = this.examData();
    if (!exam || this.questions().length === 0) {
      alert('Debes completar la información del examen y añadir al menos una pregunta.');
      return;
    }

    this.isSubmitting.set(true);

    try {
      // The exam is already created, just create the questions
      // Here you would call a service to create questions
      // For now, just navigate back
      this.router.navigate(['/exams']);
    } catch (error) {
      console.error('Error creating questions:', error);
      alert('Error al crear las preguntas. Por favor, inténtalo de nuevo.');
    } finally {
      this.isSubmitting.set(false);
    }
  }

  goBack(): void {
    this.router.navigate(['/exams']);
  }

  // Helper method to convert Exam to CreateExamRequest
  examToCreateExamRequest(exam: Exam): Partial<CreateExamRequest> {
    return {
      title: exam.title,
      description: exam.description,
      timeLimit: exam.timeLimit,
      passingScore: exam.passingScore
    };
  }
}

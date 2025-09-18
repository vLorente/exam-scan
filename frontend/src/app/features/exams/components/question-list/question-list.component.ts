import { Component, ChangeDetectionStrategy, input, output, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateQuestionRequest, QuestionType } from '@core/models';

@Component({
  selector: 'app-question-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
  templateUrl: './question-list.component.html',
  styleUrl: './question-list.component.css'
})
export class QuestionListComponent {
  // Inputs
  questions = input.required<CreateQuestionRequest[]>();

  // Outputs
  editQuestion = output<number>();
  deleteQuestion = output<number>();

  // Computed
  totalPoints = computed(() =>
    this.questions().reduce((total, q) => total + q.points, 0)
  );

  getTypeLabel(type: QuestionType): string {
    const labels = {
      'multiple_choice': 'Opción Múltiple',
      'single_choice': 'Opción Única',
      'true_false': 'V/F',
      'short_answer': 'Respuesta Corta'
    };
    return labels[type];
  }

  getOptionLetter(index: number): string {
    return String.fromCharCode(65 + index); // A, B, C, D, etc.
  }
}

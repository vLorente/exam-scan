import { Component, input, output, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Exam } from '@core/models';

@Component({
  selector: 'app-exam-summary',
  imports: [CommonModule, MatIconModule],
  templateUrl: './exam-summary.html',
  styleUrl: './exam-summary.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExamSummaryComponent {
  exam = input.required<Exam>();
  isEditing = input<boolean>(false);

  editExam = output<void>();
}

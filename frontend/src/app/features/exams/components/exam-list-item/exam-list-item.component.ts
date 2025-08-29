import { Component, input, output, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Exam } from '@core/models';

@Component({
  selector: 'app-exam-list-item',
  templateUrl: './exam-list-item.component.html',
  styleUrls: ['./exam-list-item.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule]
})
export class ExamListItemComponent {
  // Input properties
  exam = input.required<Exam>();
  showActions = input<boolean>(true);

  // Output events
  examClick = output<Exam>();

  onExamClick(): void {
    if (this.exam().isActive) {
      this.examClick.emit(this.exam());
    }
  }

  onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.onExamClick();
    }
  }

  getExamStatusClass(): string {
    return this.exam().isActive ? 'status-active' : 'status-inactive';
  }

  getExamStatusText(): string {
    return this.exam().isActive ? 'Disponible' : 'No disponible';
  }

  formatDuration(minutes?: number): string {
    if (!minutes) return 'Sin límite';

    if (minutes < 60) {
      return `${minutes}min`;
    }

    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;

    if (remainingMinutes === 0) {
      return `${hours}h`;
    }

    return `${hours}h ${remainingMinutes}min`;
  }
}

import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-create-exam-cta',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
  templateUrl: './create-exam-cta.component.html',
  styleUrl: './create-exam-cta.component.css'
})
export class CreateExamCtaComponent {
  constructor(private router: Router) {}

  navigateToCreateExam(): void {
    this.router.navigate(['/exams/create']);
  }
}

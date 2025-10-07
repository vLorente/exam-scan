import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExamSummaryComponent } from './exam-summary';
import { Exam } from '@core/models';
import { signal } from '@angular/core';

describe('ExamSummaryComponent', () => {
  let component: ExamSummaryComponent;
  let fixture: ComponentFixture<ExamSummaryComponent>;
  const mockExam: Exam = {
    id: 1,
    title: 'Test Exam',
    description: 'Test exam description',
    createdBy: 1,
    isActive: true,
    timeLimit: 60,
    totalQuestions: 10,
    passingScore: 70,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExamSummaryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExamSummaryComponent);
    component = fixture.componentInstance;
    // Set the exam input, which is required
    fixture.componentRef.setInput('exam', mockExam);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

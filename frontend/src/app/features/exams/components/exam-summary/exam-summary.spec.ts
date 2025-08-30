import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExamSummary } from './exam-summary';

describe('ExamSummary', () => {
  let component: ExamSummary;
  let fixture: ComponentFixture<ExamSummary>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExamSummary]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExamSummary);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ExamCardComponent } from './exam-card.component';
import { Exam } from '@core/models';

describe('ExamCardComponent', () => {
  let component: ExamCardComponent;
  let fixture: ComponentFixture<ExamCardComponent>;

  const mockExam: Exam = {
    id: 1,
    title: 'Test Exam',
    description: 'A test exam description',
    totalQuestions: 25,
    timeLimit: 45,
    passingScore: 70,
    isActive: true,
    createdBy: 1,
    createdAt: new Date(),
    updatedAt: new Date()
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExamCardComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(ExamCardComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('exam', mockExam);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display exam title', () => {
    const titleElement = fixture.nativeElement.querySelector('.exam-title');
    expect(titleElement.textContent.trim()).toBe('Test Exam');
  });

  it('should display exam stats', () => {
    const stats = fixture.nativeElement.querySelectorAll('.stat-number');
    expect(stats[0].textContent.trim()).toBe('25');
    expect(stats[1].textContent.trim()).toBe('45min');
    expect(stats[2].textContent.trim()).toBe('70%');
  });

  it('should emit examClick when clicked and exam is active', () => {
    spyOn(component.examClick, 'emit');
    const cardElement = fixture.nativeElement.querySelector('.exam-card');
    cardElement.click();
    expect(component.examClick.emit).toHaveBeenCalledWith(mockExam);
  });

  it('should not emit examClick when exam is inactive', () => {
    const inactiveExam = { ...mockExam, isActive: false };
    fixture.componentRef.setInput('exam', inactiveExam);
    fixture.detectChanges();

    spyOn(component.examClick, 'emit');
    const cardElement = fixture.nativeElement.querySelector('.exam-card');
    cardElement.click();
    expect(component.examClick.emit).not.toHaveBeenCalled();
  });

  it('should format duration correctly', () => {
    expect(component.formatDuration(45)).toBe('45min');
    expect(component.formatDuration(60)).toBe('1h');
    expect(component.formatDuration(90)).toBe('1h 30min');
    expect(component.formatDuration(undefined)).toBe('Sin límite');
  });

  it('should handle keyboard navigation', () => {
    spyOn(component.examClick, 'emit');
    const cardElement = fixture.nativeElement.querySelector('.exam-card');

    const enterEvent = new KeyboardEvent('keydown', { key: 'Enter' });
    cardElement.dispatchEvent(enterEvent);
    expect(component.examClick.emit).toHaveBeenCalledWith(mockExam);

    const spaceEvent = new KeyboardEvent('keydown', { key: ' ' });
    cardElement.dispatchEvent(spaceEvent);
    expect(component.examClick.emit).toHaveBeenCalledTimes(2);
  });
});

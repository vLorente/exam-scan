import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ExamListItemComponent } from './exam-list-item.component';
import { Exam } from '@core/models';

describe('ExamListItemComponent', () => {
  let component: ExamListItemComponent;
  let fixture: ComponentFixture<ExamListItemComponent>;

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
      imports: [ExamListItemComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(ExamListItemComponent);
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

  it('should display exam metadata', () => {
    const metaValues = fixture.nativeElement.querySelectorAll('.meta-value');
    expect(metaValues[0].textContent.trim()).toBe('25');
    expect(metaValues[1].textContent.trim()).toBe('45min');
    expect(metaValues[2].textContent.trim()).toBe('70%');
  });

  it('should emit examClick when clicked and exam is active', () => {
    spyOn(component.examClick, 'emit');
    const itemElement = fixture.nativeElement.querySelector('.exam-list-item');
    itemElement.click();
    expect(component.examClick.emit).toHaveBeenCalledWith(mockExam);
  });

  it('should not emit examClick when exam is inactive', () => {
    const inactiveExam = { ...mockExam, isActive: false };
    fixture.componentRef.setInput('exam', inactiveExam);
    fixture.detectChanges();

    spyOn(component.examClick, 'emit');
    const itemElement = fixture.nativeElement.querySelector('.exam-list-item');
    itemElement.click();
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
    const itemElement = fixture.nativeElement.querySelector('.exam-list-item');

    const enterEvent = new KeyboardEvent('keydown', { key: 'Enter' });
    itemElement.dispatchEvent(enterEvent);
    expect(component.examClick.emit).toHaveBeenCalledWith(mockExam);

    const spaceEvent = new KeyboardEvent('keydown', { key: ' ' });
    itemElement.dispatchEvent(spaceEvent);
    expect(component.examClick.emit).toHaveBeenCalledTimes(2);
  });

  it('should show correct status for active exam', () => {
    const statusElement = fixture.nativeElement.querySelector('.exam-status');
    expect(statusElement.textContent.trim()).toBe('Disponible');
    expect(statusElement).toHaveClass('status-active');
  });

  it('should show correct status for inactive exam', () => {
    const inactiveExam = { ...mockExam, isActive: false };
    fixture.componentRef.setInput('exam', inactiveExam);
    fixture.detectChanges();

    const statusElement = fixture.nativeElement.querySelector('.exam-status');
    expect(statusElement.textContent.trim()).toBe('No disponible');
    expect(statusElement).toHaveClass('status-inactive');
  });
});

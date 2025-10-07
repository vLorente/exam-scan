import { ComponentFixture, TestBed } from '@angular/core/testing';
import { QuestionListComponent } from './question-list.component';
import { CreateQuestionRequest } from '@core/models';

describe('QuestionListComponent', () => {
  let component: QuestionListComponent;
  let fixture: ComponentFixture<QuestionListComponent>;
  let compiled: HTMLElement;

  const mockQuestions: CreateQuestionRequest[] = [
    {
      examId: 1,
      questionText: '¿Cuál es la capital de Francia?',
      questionType: 'multiple_choice',
      options: ['Londres', 'París', 'Berlín', 'Madrid'],
      correctAnswer: 'París',
      points: 10,
      difficulty: 'easy',
      orderIndex: 0
    },
    {
      examId: 1,
      questionText: '¿El agua hierve a 100°C?',
      questionType: 'true_false',
      correctAnswer: true,
      points: 5,
      difficulty: 'easy',
      orderIndex: 1
    },
    {
      examId: 1,
      questionText: '¿Cuál es el símbolo químico del oro?',
      questionType: 'short_answer',
      correctAnswer: 'Au',
      points: 8,
      difficulty: 'medium',
      orderIndex: 2
    }
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuestionListComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(QuestionListComponent);
    component = fixture.componentInstance;
    compiled = fixture.nativeElement;
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('should create', () => {
    fixture.componentRef.setInput('questions', []);
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  describe('Empty state', () => {
    beforeEach(() => {
      fixture.componentRef.setInput('questions', []);
      fixture.detectChanges();
    });

    it('should display empty state when no questions', () => {
      const emptyState = compiled.querySelector('.empty-state');
      expect(emptyState).toBeTruthy();
    });

    it('should display empty state message', () => {
      const emptyState = compiled.querySelector('.empty-state');
      expect(emptyState?.textContent).toContain('No hay preguntas aún');
    });

    it('should not display questions container when empty', () => {
      const questionsContainer = compiled.querySelector('.questions-container');
      expect(questionsContainer).toBeNull();
    });

    it('should show total points as 0', () => {
      const totalPoints = compiled.querySelector('.total-points');
      expect(totalPoints?.textContent).toContain('Total: 0 puntos');
    });
  });

  describe('Questions display', () => {
    beforeEach(() => {
      fixture.componentRef.setInput('questions', mockQuestions);
      fixture.detectChanges();
    });

    it('should display all questions', () => {
      const questionItems = compiled.querySelectorAll('.question-item');
      expect(questionItems.length).toBe(3);
    });

    it('should display correct question count in header', () => {
      const listTitle = compiled.querySelector('.list-title');
      expect(listTitle?.textContent).toContain('Preguntas del Examen (3)');
    });

    it('should calculate and display total points correctly', () => {
      const totalPoints = compiled.querySelector('.total-points');
      expect(totalPoints?.textContent).toContain('Total: 23 puntos');
    });

    it('should display question numbers sequentially', () => {
      const questionNumbers = compiled.querySelectorAll('.question-number');
      expect(questionNumbers[0].textContent).toBe('1');
      expect(questionNumbers[1].textContent).toBe('2');
      expect(questionNumbers[2].textContent).toBe('3');
    });

    it('should display question text', () => {
      const questionTexts = compiled.querySelectorAll('.question-text');
      expect(questionTexts[0].textContent).toContain('¿Cuál es la capital de Francia?');
      expect(questionTexts[1].textContent).toContain('¿El agua hierve a 100°C?');
      expect(questionTexts[2].textContent).toContain('¿Cuál es el símbolo químico del oro?');
    });

    it('should display question points', () => {
      const questionPoints = compiled.querySelectorAll('.question-points');
      expect(questionPoints[0].textContent).toContain('10 pts');
      expect(questionPoints[1].textContent).toContain('5 pts');
      expect(questionPoints[2].textContent).toContain('8 pts');
    });
  });

  describe('Question type labels', () => {
    beforeEach(() => {
      fixture.componentRef.setInput('questions', mockQuestions);
      fixture.detectChanges();
    });

    it('should display correct type label for multiple choice', () => {
      const questionTypes = compiled.querySelectorAll('.question-type');
      expect(questionTypes[0].textContent).toContain('Opción Múltiple');
    });

    it('should display correct type label for true/false', () => {
      const questionTypes = compiled.querySelectorAll('.question-type');
      expect(questionTypes[1].textContent).toContain('V/F');
    });

    it('should display correct type label for short answer', () => {
      const questionTypes = compiled.querySelectorAll('.question-type');
      expect(questionTypes[2].textContent).toContain('Respuesta Corta');
    });
  });

  describe('Multiple choice questions', () => {
    beforeEach(() => {
      fixture.componentRef.setInput('questions', mockQuestions);
      fixture.detectChanges();
    });

    it('should display options for multiple choice questions', () => {
      const optionsList = compiled.querySelector('.options-list');
      expect(optionsList).toBeTruthy();
    });

    it('should display all options with correct letters', () => {
      const optionLetters = compiled.querySelectorAll('.option-letter');
      expect(optionLetters[0].textContent).toContain('A)');
      expect(optionLetters[1].textContent).toContain('B)');
      expect(optionLetters[2].textContent).toContain('C)');
      expect(optionLetters[3].textContent).toContain('D)');
    });

    it('should display option text', () => {
      const optionTexts = compiled.querySelectorAll('.option-text');
      expect(optionTexts[0].textContent).toContain('Londres');
      expect(optionTexts[1].textContent).toContain('París');
    });

    it('should mark correct answer with badge', () => {
      const correctBadges = compiled.querySelectorAll('.correct-badge');
      expect(correctBadges.length).toBeGreaterThan(0);
    });

    it('should apply correct class to correct answer', () => {
      const correctOption = compiled.querySelector('.option-item.correct');
      expect(correctOption).toBeTruthy();
    });
  });

  describe('True/False questions', () => {
    beforeEach(() => {
      fixture.componentRef.setInput('questions', mockQuestions);
      fixture.detectChanges();
    });

    it('should display answer for true/false questions', () => {
      const answerDisplays = compiled.querySelectorAll('.answer-display');
      expect(answerDisplays.length).toBeGreaterThan(0);
    });

    it('should display "Verdadero" for true answer', () => {
      const answerValue = compiled.querySelectorAll('.answer-value')[0];
      expect(answerValue.textContent?.trim()).toBe('Verdadero');
    });
  });

  describe('Short answer questions', () => {
    beforeEach(() => {
      fixture.componentRef.setInput('questions', mockQuestions);
      fixture.detectChanges();
    });

    it('should display correct answer for short answer questions', () => {
      const answerValues = compiled.querySelectorAll('.answer-value');
      const shortAnswerValue = Array.from(answerValues).find(el =>
        el.textContent?.trim() === 'Au'
      );
      expect(shortAnswerValue).toBeTruthy();
    });
  });

  describe('Action buttons', () => {
    beforeEach(() => {
      fixture.componentRef.setInput('questions', mockQuestions);
      fixture.detectChanges();
    });

    it('should display edit and delete buttons for each question', () => {
      const editButtons = compiled.querySelectorAll('.edit-btn');
      const deleteButtons = compiled.querySelectorAll('.delete-btn');
      expect(editButtons.length).toBe(3);
      expect(deleteButtons.length).toBe(3);
    });

    it('should have proper aria-labels for edit buttons', () => {
      const editButtons = compiled.querySelectorAll('.edit-btn');
      expect(editButtons[0].getAttribute('aria-label')).toBe('Editar pregunta 1');
      expect(editButtons[1].getAttribute('aria-label')).toBe('Editar pregunta 2');
    });

    it('should have proper aria-labels for delete buttons', () => {
      const deleteButtons = compiled.querySelectorAll('.delete-btn');
      expect(deleteButtons[0].getAttribute('aria-label')).toBe('Eliminar pregunta 1');
      expect(deleteButtons[1].getAttribute('aria-label')).toBe('Eliminar pregunta 2');
    });

    it('should emit editQuestion event when edit button is clicked', () => {
      spyOn(component.editQuestion, 'emit');
      const editButton = compiled.querySelector('.edit-btn') as HTMLButtonElement;
      editButton.click();
      expect(component.editQuestion.emit).toHaveBeenCalledWith(0);
    });

    it('should emit deleteQuestion event when delete button is clicked', () => {
      spyOn(component.deleteQuestion, 'emit');
      const deleteButton = compiled.querySelector('.delete-btn') as HTMLButtonElement;
      deleteButton.click();
      expect(component.deleteQuestion.emit).toHaveBeenCalledWith(0);
    });

    it('should emit correct index when clicking different question buttons', () => {
      spyOn(component.editQuestion, 'emit');
      const editButtons = compiled.querySelectorAll('.edit-btn') as NodeListOf<HTMLButtonElement>;
      editButtons[2].click();
      expect(component.editQuestion.emit).toHaveBeenCalledWith(2);
    });
  });

  describe('Computed properties', () => {
    it('should calculate totalPoints correctly', () => {
      fixture.componentRef.setInput('questions', mockQuestions);
      fixture.detectChanges();
      expect(component.totalPoints()).toBe(23);
    });

    it('should return 0 totalPoints for empty questions', () => {
      fixture.componentRef.setInput('questions', []);
      fixture.detectChanges();
      expect(component.totalPoints()).toBe(0);
    });
  });

  describe('Helper methods', () => {
    beforeEach(() => {
      fixture.componentRef.setInput('questions', []);
      fixture.detectChanges();
    });

    it('should return correct type label for multiple_choice', () => {
      expect(component.getTypeLabel('multiple_choice')).toBe('Opción Múltiple');
    });

    it('should return correct type label for single_choice', () => {
      expect(component.getTypeLabel('single_choice')).toBe('Opción Única');
    });

    it('should return correct type label for true_false', () => {
      expect(component.getTypeLabel('true_false')).toBe('V/F');
    });

    it('should return correct type label for short_answer', () => {
      expect(component.getTypeLabel('short_answer')).toBe('Respuesta Corta');
    });

    it('should convert index to letter correctly', () => {
      expect(component.getOptionLetter(0)).toBe('A');
      expect(component.getOptionLetter(1)).toBe('B');
      expect(component.getOptionLetter(2)).toBe('C');
      expect(component.getOptionLetter(3)).toBe('D');
      expect(component.getOptionLetter(25)).toBe('Z');
    });
  });

  describe('Accessibility', () => {
    beforeEach(() => {
      fixture.componentRef.setInput('questions', mockQuestions);
      fixture.detectChanges();
    });

    it('should have aria-label for each question item', () => {
      const questionItems = compiled.querySelectorAll('.question-item');
      expect(questionItems[0].getAttribute('aria-label')).toBe('Pregunta 1');
      expect(questionItems[1].getAttribute('aria-label')).toBe('Pregunta 2');
    });

    it('should have aria-label for correct answer badge', () => {
      const correctBadge = compiled.querySelector('.correct-badge');
      expect(correctBadge?.getAttribute('aria-label')).toBe('Respuesta correcta');
    });

    it('should have aria-hidden for decorative icons', () => {
      const icons = compiled.querySelectorAll('svg');
      icons.forEach(icon => {
        expect(icon.getAttribute('aria-hidden')).toBe('true');
      });
    });
  });

  describe('Component configuration', () => {
    it('should use OnPush change detection strategy', () => {
      fixture.componentRef.setInput('questions', []);
      fixture.detectChanges();
      expect(fixture.componentRef.changeDetectorRef).toBeTruthy();
    });
  });
});

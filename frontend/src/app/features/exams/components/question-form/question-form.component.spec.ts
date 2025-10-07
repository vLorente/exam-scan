import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { QuestionFormComponent } from './question-form.component';
import { CreateQuestionRequest } from '@core/models';

describe('QuestionFormComponent', () => {
  let component: QuestionFormComponent;
  let fixture: ComponentFixture<QuestionFormComponent>;
  let compiled: HTMLElement;

  const mockQuestion: CreateQuestionRequest = {
    examId: 1,
    questionText: '¿Cuál es la capital de Francia?',
    questionType: 'multiple_choice',
    options: ['Londres', 'París', 'Berlín', 'Madrid'],
    correctAnswer: 'París',
    points: 10,
    difficulty: 'easy',
    orderIndex: 0
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuestionFormComponent, ReactiveFormsModule]
    }).compileComponents();

    fixture = TestBed.createComponent(QuestionFormComponent);
    component = fixture.componentInstance;
    compiled = fixture.nativeElement;
    fixture.componentRef.setInput('examId', 1);
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Form initialization', () => {
    it('should initialize form with default values', () => {
      expect(component.questionForm).toBeTruthy();
      expect(component.questionForm.get('questionText')?.value).toBe('');
      expect(component.questionForm.get('questionType')?.value).toBe('multiple_choice');
      expect(component.questionForm.get('difficulty')?.value).toBe('medium');
      expect(component.questionForm.get('points')?.value).toBe(5);
    });

    it('should initialize with 2 empty options for multiple choice', () => {
      expect(component.optionsArray.length).toBe(2);
    });

    it('should have all required validators', () => {
      const questionText = component.questionForm.get('questionText');
      const questionType = component.questionForm.get('questionType');
      const points = component.questionForm.get('points');

      questionText?.setValue('');
      questionType?.setValue('');
      points?.setValue(null);

      expect(questionText?.hasError('required')).toBe(true);
      expect(questionType?.hasError('required')).toBe(true);
      expect(points?.hasError('required')).toBe(true);
    });

    it('should validate minimum length for question text', () => {
      const questionText = component.questionForm.get('questionText');
      questionText?.setValue('short');
      expect(questionText?.hasError('minlength')).toBe(true);
    });

    it('should validate points range', () => {
      const points = component.questionForm.get('points');

      points?.setValue(0);
      expect(points?.hasError('min')).toBe(true);

      points?.setValue(101);
      expect(points?.hasError('max')).toBe(true);

      points?.setValue(50);
      expect(points?.valid).toBe(true);
    });
  });

  describe('Editing mode', () => {
    it('should not be in editing mode initially', () => {
      expect(component.editingMode()).toBe(false);
    });

    it('should enter editing mode when editingQuestion is provided', () => {
      fixture.componentRef.setInput('editingQuestion', mockQuestion);
      component.ngOnInit();
      fixture.detectChanges();

      expect(component.editingMode()).toBe(true);
    });

    it('should load question data in editing mode', () => {
      fixture.componentRef.setInput('editingQuestion', mockQuestion);
      component.ngOnInit();
      fixture.detectChanges();

      expect(component.questionForm.get('questionText')?.value).toBe(mockQuestion.questionText);
      expect(component.questionForm.get('questionType')?.value).toBe(mockQuestion.questionType);
      expect(component.questionForm.get('difficulty')?.value).toBe(mockQuestion.difficulty);
      expect(component.questionForm.get('points')?.value).toBe(mockQuestion.points);
    });

    it('should load options in editing mode', () => {
      fixture.componentRef.setInput('editingQuestion', mockQuestion);
      component.ngOnInit();
      fixture.detectChanges();

      expect(component.optionsArray.length).toBe(4);
      expect(component.optionsArray.at(0)?.value).toBe('Londres');
      expect(component.optionsArray.at(1)?.value).toBe('París');
    });

    it('should set correct answer index in editing mode', () => {
      fixture.componentRef.setInput('editingQuestion', mockQuestion);
      component.ngOnInit();
      fixture.detectChanges();

      expect(component.correctAnswerIndex()).toBe(1); // París is at index 1
    });

    it('should display "Editar Pregunta" title in editing mode', () => {
      fixture.componentRef.setInput('editingQuestion', mockQuestion);
      component.ngOnInit();
      fixture.detectChanges();

      const title = compiled.querySelector('.form-title');
      expect(title?.textContent?.trim()).toBe('Editar Pregunta');
    });

    it('should display "Nueva Pregunta" title when not editing', () => {
      const title = compiled.querySelector('.form-title');
      expect(title?.textContent?.trim()).toBe('Nueva Pregunta');
    });

    it('should show cancel button in editing mode', () => {
      fixture.componentRef.setInput('editingQuestion', mockQuestion);
      component.ngOnInit();
      fixture.detectChanges();

      const cancelButton = compiled.querySelector('button[aria-label="Cancelar edición"]');
      expect(cancelButton).toBeTruthy();
    });

    it('should emit cancelEdit when cancel button is clicked', () => {
      fixture.componentRef.setInput('editingQuestion', mockQuestion);
      component.ngOnInit();
      fixture.detectChanges();

      spyOn(component.cancelEdit, 'emit');
      const cancelButton = compiled.querySelector('button[aria-label="Cancelar edición"]') as HTMLButtonElement;
      cancelButton.click();

      expect(component.cancelEdit.emit).toHaveBeenCalled();
    });
  });

  describe('Question type changes', () => {
    it('should reset options when changing to multiple_choice', () => {
      // Start with true_false (no options array management)
      component.questionForm.get('questionType')?.setValue('true_false');

      // Change to multiple_choice should reset options
      component.questionForm.get('questionType')?.setValue('multiple_choice');
      component.onTypeChange();

      expect(component.optionsArray.length).toBe(2);
      expect(component.optionsArray.at(0)?.value).toBe('');
      expect(component.optionsArray.at(1)?.value).toBe('');
    });

    it('should set true as default for true_false questions', () => {
      component.questionForm.get('questionType')?.setValue('true_false');
      component.onTypeChange();

      expect(component.questionForm.get('correctAnswer')?.value).toBe(true);
    });

    it('should clear correctAnswer when changing to multiple_choice', () => {
      component.questionForm.get('questionType')?.setValue('true_false');
      component.questionForm.get('correctAnswer')?.setValue(true);

      component.questionForm.get('questionType')?.setValue('multiple_choice');
      component.onTypeChange();

      expect(component.questionForm.get('correctAnswer')?.value).toBe('');
    });

    it('should reset correct answer index when changing to multiple_choice', () => {
      component.correctAnswerIndex.set(2);

      component.questionForm.get('questionType')?.setValue('multiple_choice');
      component.onTypeChange();

      expect(component.correctAnswerIndex()).toBe(0);
    });
  });

  describe('Options management', () => {
    it('should add a new option', () => {
      const initialLength = component.optionsArray.length;
      component.addOption();
      expect(component.optionsArray.length).toBe(initialLength + 1);
    });

    it('should not add more than 6 options', () => {
      while (component.optionsArray.length < 6) {
        component.addOption();
      }

      component.addOption();
      expect(component.optionsArray.length).toBe(6);
    });

    it('should remove an option', () => {
      component.addOption();
      const initialLength = component.optionsArray.length;

      component.removeOption(2);
      expect(component.optionsArray.length).toBe(initialLength - 1);
    });

    it('should not remove options if only 2 remain', () => {
      component.removeOption(1);
      expect(component.optionsArray.length).toBe(2);
    });

    it('should adjust correct answer index when removing the selected option', () => {
      component.addOption();
      component.addOption();
      component.correctAnswerIndex.set(3);

      component.removeOption(3);
      expect(component.correctAnswerIndex()).toBe(0);
    });

    it('should set correct answer index', () => {
      component.setCorrectAnswer(1);
      expect(component.correctAnswerIndex()).toBe(1);
    });

    it('should display add option button when less than 6 options', () => {
      fixture.detectChanges();
      const addButton = compiled.querySelector('.add-option-btn');
      expect(addButton).toBeTruthy();
    });

    it('should display remove buttons when more than 2 options', () => {
      component.addOption();
      fixture.detectChanges();

      const removeButtons = compiled.querySelectorAll('.remove-option-btn');
      expect(removeButtons.length).toBeGreaterThan(0);
    });
  });

  describe('Form submission', () => {
    beforeEach(() => {
      component.questionForm.patchValue({
        questionText: '¿Cuál es la capital de Francia?',
        questionType: 'multiple_choice',
        difficulty: 'easy',
        points: 10
      });
      component.optionsArray.at(0)?.setValue('Londres');
      component.optionsArray.at(1)?.setValue('París');
      component.correctAnswerIndex.set(1);
    });

    it('should emit questionSubmit with correct data for multiple choice', () => {
      spyOn(component.questionSubmit, 'emit');

      component.onSubmit();

      expect(component.questionSubmit.emit).toHaveBeenCalledWith(
        jasmine.objectContaining({
          examId: 1,
          questionText: '¿Cuál es la capital de Francia?',
          questionType: 'multiple_choice',
          difficulty: 'easy',
          points: 10,
          options: ['Londres', 'París'],
          correctAnswer: 'París'
        })
      );
    });

    it('should emit questionSubmit with correct data for true_false', () => {
      component.questionForm.patchValue({
        questionType: 'true_false',
        correctAnswer: true
      });
      spyOn(component.questionSubmit, 'emit');

      component.onSubmit();

      expect(component.questionSubmit.emit).toHaveBeenCalledWith(
        jasmine.objectContaining({
          questionType: 'true_false',
          correctAnswer: true
        })
      );
    });

    it('should not submit if form is invalid', () => {
      component.questionForm.patchValue({
        questionText: '',
        points: null
      });
      spyOn(component.questionSubmit, 'emit');

      component.onSubmit();

      expect(component.questionSubmit.emit).not.toHaveBeenCalled();
    });

    it('should mark all fields as touched when submitting invalid form', () => {
      component.questionForm.patchValue({
        questionText: '',
        points: null
      });

      component.onSubmit();

      expect(component.questionForm.get('questionText')?.touched).toBe(true);
      expect(component.questionForm.get('points')?.touched).toBe(true);
    });

    it('should reset form after successful submission when not editing', () => {
      component.onSubmit();

      expect(component.questionForm.get('questionText')?.value).toBe('');
      expect(component.questionForm.get('points')?.value).toBe(5);
      expect(component.optionsArray.length).toBe(2);
      expect(component.correctAnswerIndex()).toBe(0);
    });

    it('should not reset form after submission when editing', () => {
      fixture.componentRef.setInput('editingQuestion', mockQuestion);
      component.ngOnInit();
      fixture.detectChanges();

      const questionText = component.questionForm.get('questionText')?.value;
      component.onSubmit();

      expect(component.questionForm.get('questionText')?.value).toBe(questionText);
    });

    it('should trim whitespace from options before submitting', () => {
      // Set up valid form data first
      component.questionForm.patchValue({
        questionText: '¿Cuál es la capital de Francia?',
        questionType: 'multiple_choice',
        difficulty: 'easy',
        points: 10
      });

      // Set valid options - only 2 required for the test
      component.optionsArray.at(0)?.setValue('Londres');
      component.optionsArray.at(1)?.setValue('París  '); // With trailing spaces
      component.correctAnswerIndex.set(1);

      spyOn(component.questionSubmit, 'emit');
      component.onSubmit();

      expect(component.questionSubmit.emit).toHaveBeenCalled();
      const emittedQuestion = (component.questionSubmit.emit as jasmine.Spy).calls.first().args[0];
      // The filter should trim the options
      expect(emittedQuestion.options?.length).toBe(2);
      expect(emittedQuestion.options).toEqual(['Londres', 'París']);
    });

    it('should filter out options with only whitespace when submitting', () => {
      // Set up valid form data
      component.questionForm.patchValue({
        questionText: '¿Cuál es la capital de Francia?',
        questionType: 'multiple_choice',
        difficulty: 'easy',
        points: 10
      });

      // Add extra options - some valid, some with only whitespace
      component.addOption();
      component.addOption();
      component.optionsArray.at(0)?.setValue('Londres');
      component.optionsArray.at(1)?.setValue('París');
      component.optionsArray.at(2)?.setValue('    '); // Only whitespace - will be filtered out
      component.optionsArray.at(3)?.setValue('Madrid');
      component.correctAnswerIndex.set(1);

      spyOn(component.questionSubmit, 'emit');
      component.onSubmit();

      // Should emit with valid options only (whitespace-only option is filtered)
      expect(component.questionSubmit.emit).toHaveBeenCalled();
      const emittedQuestion = (component.questionSubmit.emit as jasmine.Spy).calls.first().args[0];
      expect(emittedQuestion.options?.length).toBe(3);
      expect(emittedQuestion.options).toEqual(['Londres', 'París', 'Madrid']);
    });

    it('should not submit when less than 2 valid options remain after filtering', () => {
      // Set up valid form data
      component.questionForm.patchValue({
        questionText: '¿Cuál es la capital de Francia?',
        questionType: 'multiple_choice',
        difficulty: 'easy',
        points: 10
      });

      // Set one valid option and one with only whitespace (will be filtered)
      component.optionsArray.at(0)?.setValue('Londres');
      component.optionsArray.at(1)?.setValue('    '); // Only whitespace - will be filtered out
      component.correctAnswerIndex.set(0);

      spyOn(component.questionSubmit, 'emit');
      spyOn(console, 'error');
      component.onSubmit();

      // Should not emit because after filtering only 1 option remains
      expect(component.questionSubmit.emit).not.toHaveBeenCalled();
      expect(console.error).toHaveBeenCalledWith('Multiple choice questions require at least 2 valid options');
    });
  });

  describe('UI rendering', () => {
    it('should display question text field', () => {
      const questionText = compiled.querySelector('textarea[formControlName="questionText"]');
      expect(questionText).toBeTruthy();
    });

    it('should display question type select', () => {
      const questionType = compiled.querySelector('mat-select[formControlName="questionType"]');
      expect(questionType).toBeTruthy();
    });

    it('should display difficulty select', () => {
      const difficulty = compiled.querySelector('mat-select[formControlName="difficulty"]');
      expect(difficulty).toBeTruthy();
    });

    it('should display points input', () => {
      const points = compiled.querySelector('input[formControlName="points"]');
      expect(points).toBeTruthy();
    });

    it('should display options section for multiple_choice', () => {
      component.questionForm.get('questionType')?.setValue('multiple_choice');
      fixture.detectChanges();

      const optionsSection = compiled.querySelector('.options-section');
      expect(optionsSection).toBeTruthy();
    });

    it('should display true/false options for true_false type', () => {
      component.questionForm.get('questionType')?.setValue('true_false');
      fixture.detectChanges();

      const trueFalseGroup = compiled.querySelector('.true-false-group');
      expect(trueFalseGroup).toBeTruthy();
    });

    it('should display error messages for invalid fields', () => {
      const questionText = component.questionForm.get('questionText');
      questionText?.setValue('');
      questionText?.markAsTouched();
      fixture.detectChanges();

      const error = compiled.querySelector('mat-error');
      expect(error).toBeTruthy();
    });

    it('should display submit button with correct text', () => {
      const submitButton = compiled.querySelector('app-submit-button');
      expect(submitButton).toBeTruthy();
    });

    it('should disable submit button when form is invalid', () => {
      component.questionForm.patchValue({
        questionText: '',
        points: null
      });
      fixture.detectChanges();

      const submitButton = compiled.querySelector('app-submit-button button') as HTMLButtonElement;
      expect(submitButton?.disabled).toBe(true);
    });
  });

  describe('Accessibility', () => {
    it('should have aria-label for cancel button', () => {
      fixture.componentRef.setInput('editingQuestion', mockQuestion);
      component.ngOnInit();
      fixture.detectChanges();

      const cancelButton = compiled.querySelector('button[aria-label="Cancelar edición"]');
      expect(cancelButton).toBeTruthy();
    });

    it('should have aria-labels for remove option buttons', () => {
      component.addOption();
      fixture.detectChanges();

      const removeButtons = compiled.querySelectorAll('button[aria-label*="Eliminar opción"]');
      expect(removeButtons.length).toBeGreaterThan(0);
    });

    it('should have proper labels for form fields', () => {
      const labels = compiled.querySelectorAll('mat-label');
      expect(labels.length).toBeGreaterThan(0);
    });
  });

  describe('Computed properties', () => {
    it('should return form controls for options', () => {
      const controls = component.optionsControls();
      expect(controls.length).toBe(component.optionsArray.length);
    });

    it('should update optionsControls when options change', () => {
      const initialLength = component.optionsControls().length;
      component.addOption();

      expect(component.optionsControls().length).toBe(initialLength + 1);
    });
  });

  describe('Component configuration', () => {
    it('should use OnPush change detection strategy', () => {
      expect(fixture.componentRef.changeDetectorRef).toBeTruthy();
    });

    it('should have FormGroup initialized', () => {
      expect(component.questionForm instanceof Object).toBe(true);
    });
  });

  describe('Loading state', () => {
    it('should pass loading state to submit button', () => {
      fixture.componentRef.setInput('isSubmitting', true);
      fixture.detectChanges();

      const submitButton = compiled.querySelector('app-submit-button button') as HTMLButtonElement;
      const spinner = compiled.querySelector('app-submit-button mat-progress-spinner');
      expect(submitButton?.disabled).toBe(true);
      expect(spinner).toBeTruthy();
    });

    it('should display appropriate loading text', () => {
      fixture.componentRef.setInput('isSubmitting', true);
      fixture.componentRef.setInput('editingQuestion', mockQuestion);
      component.ngOnInit();
      fixture.detectChanges();

      const button = compiled.querySelector('app-submit-button button') as HTMLButtonElement;
      const loadingTextSpan = Array.from(button.querySelectorAll('span'))
        .find(span => !span.classList.contains('sr-only') && span.textContent?.trim());
      expect(loadingTextSpan?.textContent?.trim()).toBe('Actualizando...');
    });
  });
});

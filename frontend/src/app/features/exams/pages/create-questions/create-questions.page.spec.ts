import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { of } from 'rxjs';

import { CreateQuestionsPageComponent } from './create-questions.page';
import { ExamsService } from '../../services/exams.service';
import { LayoutComponent } from '../../../../shared/components/layout/layout.component';
import { HeaderComponent } from '../../../../shared/components/header/header.component';
import { FooterComponent } from '../../../../shared/components/footer/footer.component';
import { DocumentIconComponent } from '../../../../shared/components/icons/document-icon/document-icon.component';
import { QuestionType } from '../../../../core/models/question.model';

describe('CreateQuestionsPageComponent', () => {
  let component: CreateQuestionsPageComponent;
  let fixture: ComponentFixture<CreateQuestionsPageComponent>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockLocation: jasmine.SpyObj<Location>;
  let mockExamsService: jasmine.SpyObj<ExamsService>;
  let mockActivatedRoute: any;

  const mockExam = {
    id: '1',
    title: 'Test Exam',
    description: 'Test Description',
    duration: 60,
    totalQuestions: 0,
    totalPoints: 0,
    questions: []
  };

  beforeEach(async () => {
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockLocation = jasmine.createSpyObj('Location', ['back']);
    mockExamsService = jasmine.createSpyObj('ExamsService', ['getExamById', 'createQuestion', 'updateQuestion', 'deleteQuestion']);
    mockActivatedRoute = {
      paramMap: of(new Map([['id', '1']]))
    };

    await TestBed.configureTestingModule({
      imports: [
        CreateQuestionsPageComponent,
        ReactiveFormsModule,
        LayoutComponent,
        HeaderComponent,
        FooterComponent,
        DocumentIconComponent
      ],
      providers: [
        FormBuilder,
        { provide: Router, useValue: mockRouter },
        { provide: Location, useValue: mockLocation },
        { provide: ExamsService, useValue: mockExamsService },
        { provide: ActivatedRoute, useValue: mockActivatedRoute }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CreateQuestionsPageComponent);
    component = fixture.componentInstance;

    // Setup service mocks
    mockExamsService.getExamById.and.returnValue(of(mockExam));
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Component Initialization', () => {
    it('should initialize with exam data on ngOnInit', () => {
      fixture.detectChanges();

      expect(component.exam()).toEqual(mockExam);
      expect(mockExamsService.getExamById).toHaveBeenCalledWith('1');
    });

    it('should initialize empty question form', () => {
      fixture.detectChanges();

      expect(component.questionForm).toBeDefined();
      expect(component.questionForm.get('text')?.value).toBe('');
      expect(component.questionForm.get('type')?.value).toBe('multiple_choice');
      expect(component.questionForm.get('points')?.value).toBe(1);
    });

    it('should initialize with multiple choice options by default', () => {
      fixture.detectChanges();

      const optionsArray = component.questionForm.get('options');
      expect(optionsArray?.value.length).toBe(2);
      expect(optionsArray?.value[0]).toEqual({ text: '', isCorrect: true });
      expect(optionsArray?.value[1]).toEqual({ text: '', isCorrect: false });
    });
  });

  describe('Question Type Management', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should handle multiple choice type', () => {
      component.questionForm.patchValue({ type: 'multiple_choice' });
      component.onQuestionTypeChange();

      const optionsArray = component.questionForm.get('options');
      expect(optionsArray?.value.length).toBe(2);
      expect(component.questionForm.get('correctAnswer')?.value).toBe('');
    });

    it('should handle true/false type', () => {
      component.questionForm.patchValue({ type: 'true_false' });
      component.onQuestionTypeChange();

      const optionsArray = component.questionForm.get('options');
      expect(optionsArray?.value.length).toBe(0);
      expect(component.questionForm.get('correctAnswer')?.value).toBe('true');
    });

    it('should handle short answer type', () => {
      component.questionForm.patchValue({ type: 'short_answer' });
      component.onQuestionTypeChange();

      const optionsArray = component.questionForm.get('options');
      expect(optionsArray?.value.length).toBe(0);
      expect(component.questionForm.get('correctAnswer')?.value).toBe('');
    });
  });

  describe('Options Management', () => {
    beforeEach(() => {
      fixture.detectChanges();
      component.questionForm.patchValue({ type: 'multiple_choice' });
      component.onQuestionTypeChange();
    });

    it('should add new option', () => {
      const initialLength = component.options.length;
      component.addOption();

      expect(component.options.length).toBe(initialLength + 1);
      const newOption = component.options.at(initialLength).value;
      expect(newOption).toEqual({ text: '', isCorrect: false });
    });

    it('should remove option when more than 2 exist', () => {
      component.addOption(); // Add third option
      const initialLength = component.options.length;

      component.removeOption(1);

      expect(component.options.length).toBe(initialLength - 1);
    });

    it('should not remove option when only 2 exist', () => {
      const initialLength = component.options.length;

      component.removeOption(1);

      expect(component.options.length).toBe(initialLength);
    });

    it('should set correct answer for multiple choice', () => {
      component.setCorrectAnswer(1);

      expect(component.options.at(0).get('isCorrect')?.value).toBe(false);
      expect(component.options.at(1).get('isCorrect')?.value).toBe(true);
    });
  });

  describe('Form Validation', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should validate required question text', () => {
      component.questionForm.patchValue({ text: '' });
      expect(component.questionForm.get('text')?.invalid).toBe(true);
      expect(component.questionForm.get('text')?.errors?.['required']).toBe(true);
    });

    it('should validate minimum question text length', () => {
      component.questionForm.patchValue({ text: 'ab' });
      expect(component.questionForm.get('text')?.invalid).toBe(true);
      expect(component.questionForm.get('text')?.errors?.['minlength']).toBeDefined();
    });

    it('should validate points range', () => {
      component.questionForm.patchValue({ points: 0 });
      expect(component.questionForm.get('points')?.invalid).toBe(true);

      component.questionForm.patchValue({ points: 101 });
      expect(component.questionForm.get('points')?.invalid).toBe(true);

      component.questionForm.patchValue({ points: 5 });
      expect(component.questionForm.get('points')?.valid).toBe(true);
    });

    it('should validate multiple choice options', () => {
      component.questionForm.patchValue({
        text: 'Valid question text',
        type: 'multiple_choice'
      });

      // Set empty options
      component.options.at(0).patchValue({ text: '', isCorrect: true });
      component.options.at(1).patchValue({ text: '', isCorrect: false });

      expect(component.isFormValid()).toBe(false);

      // Set valid options
      component.options.at(0).patchValue({ text: 'Option 1', isCorrect: true });
      component.options.at(1).patchValue({ text: 'Option 2', isCorrect: false });

      expect(component.isFormValid()).toBe(true);
    });
  });

  describe('Question CRUD Operations', () => {
    beforeEach(() => {
      fixture.detectChanges();
      mockExamsService.createQuestion.and.returnValue(of({
        id: '1',
        text: 'Test Question',
        type: 'multiple_choice' as QuestionType,
        points: 1,
        options: [
          { text: 'Option 1', isCorrect: true },
          { text: 'Option 2', isCorrect: false }
        ]
      }));
    });

    it('should add question successfully', () => {
      component.questionForm.patchValue({
        text: 'Test Question',
        type: 'multiple_choice',
        points: 1
      });
      component.options.at(0).patchValue({ text: 'Option 1', isCorrect: true });
      component.options.at(1).patchValue({ text: 'Option 2', isCorrect: false });

      component.addQuestion();

      expect(mockExamsService.createQuestion).toHaveBeenCalled();
      expect(component.questions().length).toBe(1);
      expect(component.questionForm.get('text')?.value).toBe(''); // Form should be reset
    });

    it('should not add question if form is invalid', () => {
      component.questionForm.patchValue({ text: '' }); // Invalid form

      component.addQuestion();

      expect(mockExamsService.createQuestion).not.toHaveBeenCalled();
      expect(component.questions().length).toBe(0);
    });

    it('should edit question', () => {
      const mockQuestion = {
        id: '1',
        text: 'Test Question',
        type: 'multiple_choice' as QuestionType,
        points: 1,
        options: [
          { text: 'Option 1', isCorrect: true },
          { text: 'Option 2', isCorrect: false }
        ]
      };
      component.questions.set([mockQuestion]);

      component.editQuestion(mockQuestion);

      expect(component.editingQuestionId()).toBe('1');
      expect(component.questionForm.get('text')?.value).toBe('Test Question');
      expect(component.questionForm.get('type')?.value).toBe('multiple_choice');
      expect(component.questionForm.get('points')?.value).toBe(1);
    });

    it('should update question', () => {
      const mockQuestion = {
        id: '1',
        text: 'Test Question',
        type: 'multiple_choice' as QuestionType,
        points: 1,
        options: [
          { text: 'Option 1', isCorrect: true },
          { text: 'Option 2', isCorrect: false }
        ]
      };

      component.questions.set([mockQuestion]);
      component.editingQuestionId.set('1');

      mockExamsService.updateQuestion.and.returnValue(of({
        ...mockQuestion,
        text: 'Updated Question'
      }));

      component.questionForm.patchValue({
        text: 'Updated Question',
        type: 'multiple_choice',
        points: 1
      });

      component.updateQuestion();

      expect(mockExamsService.updateQuestion).toHaveBeenCalled();
      expect(component.editingQuestionId()).toBeNull();
    });

    it('should delete question', () => {
      const mockQuestion = {
        id: '1',
        text: 'Test Question',
        type: 'multiple_choice' as QuestionType,
        points: 1,
        options: []
      };

      component.questions.set([mockQuestion]);
      mockExamsService.deleteQuestion.and.returnValue(of(void 0));

      component.deleteQuestion(mockQuestion);

      expect(mockExamsService.deleteQuestion).toHaveBeenCalledWith('1', '1');
      expect(component.questions().length).toBe(0);
    });

    it('should cancel editing', () => {
      component.editingQuestionId.set('1');
      component.questionForm.patchValue({ text: 'Some text' });

      component.cancelEdit();

      expect(component.editingQuestionId()).toBeNull();
      expect(component.questionForm.get('text')?.value).toBe('');
    });
  });

  describe('Computed Properties', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should calculate total questions', () => {
      const mockQuestions = [
        { id: '1', text: 'Q1', type: 'multiple_choice' as QuestionType, points: 1, options: [] },
        { id: '2', text: 'Q2', type: 'true_false' as QuestionType, points: 2, options: [] }
      ];
      component.questions.set(mockQuestions);

      expect(component.totalQuestions()).toBe(2);
    });

    it('should calculate total points', () => {
      const mockQuestions = [
        { id: '1', text: 'Q1', type: 'multiple_choice' as QuestionType, points: 1, options: [] },
        { id: '2', text: 'Q2', type: 'true_false' as QuestionType, points: 3, options: [] }
      ];
      component.questions.set(mockQuestions);

      expect(component.totalPoints()).toBe(4);
    });

    it('should determine if questions exist', () => {
      expect(component.hasQuestions()).toBe(false);

      component.questions.set([
        { id: '1', text: 'Q1', type: 'multiple_choice' as QuestionType, points: 1, options: [] }
      ]);

      expect(component.hasQuestions()).toBe(true);
    });
  });

  describe('Navigation', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should go back', () => {
      component.goBack();
      expect(mockLocation.back).toHaveBeenCalled();
    });

    it('should finish exam creation', () => {
      component.finishExam();
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/dashboard']);
    });
  });

  describe('Helper Methods', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should get question type display name', () => {
      expect(component.getQuestionTypeDisplay('multiple_choice')).toBe('Opción Múltiple');
      expect(component.getQuestionTypeDisplay('true_false')).toBe('Verdadero/Falso');
      expect(component.getQuestionTypeDisplay('short_answer')).toBe('Respuesta Corta');
    });

    it('should check if current question type is multiple choice', () => {
      component.questionForm.patchValue({ type: 'multiple_choice' });
      expect(component.isMultipleChoice()).toBe(true);

      component.questionForm.patchValue({ type: 'true_false' });
      expect(component.isMultipleChoice()).toBe(false);
    });

    it('should check if current question type is true/false', () => {
      component.questionForm.patchValue({ type: 'true_false' });
      expect(component.isTrueFalse()).toBe(true);

      component.questionForm.patchValue({ type: 'multiple_choice' });
      expect(component.isTrueFalse()).toBe(false);
    });
  });

  describe('Form Error Handling', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should show validation errors when form is submitted with invalid data', () => {
      component.questionForm.patchValue({ text: '' });
      component.addQuestion();

      expect(component.questionForm.get('text')?.touched).toBe(true);
    });

    it('should validate option text for multiple choice questions', () => {
      component.questionForm.patchValue({
        text: 'Valid question',
        type: 'multiple_choice'
      });

      component.options.at(0).patchValue({ text: '', isCorrect: true });

      expect(component.isFormValid()).toBe(false);
    });
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { of } from 'rxjs';

import { CreateExamPageComponent } from './create-exam.page';
import { ExamsService } from '../../services/exams.service';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { of } from 'rxjs';

import { CreateExamPageComponent } from './create-exam.page';
import { ExamsService } from '../../services/exams.service';
import { LayoutComponent } from '../../../../shared/components/layout/layout.component';
import { HeaderComponent } from '../../../../shared/components/header/header.component';
import { FooterComponent } from '../../../../shared/components/footer/footer.component';
import { Exam } from '../../../../core/models/exam.model';
    });
  });
}); LayoutComponent } from '../../../../shared/components/layout/layout.component';
import { HeaderComponent } from '../../../../shared/components/header/header.component';
import { FooterComponent } from '../../../../shared/components/footer/footer.component';
import { Exam } from '../../../../core/models/exam.model';

describe('CreateExamPageComponent', () => {
  let component: CreateExamPageComponent;
  let fixture: ComponentFixture<CreateExamPageComponent>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockExamsService: jasmine.SpyObj<ExamsService>;

  const mockExam: Exam = {
    id: 1,
    title: 'Test Exam',
    description: 'Test Description',
    timeLimit: 60,
    passingScore: 70,
    totalQuestions: 0,
    createdBy: 123,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  };

  beforeEach(async () => {
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockExamsService = jasmine.createSpyObj('ExamsService', ['createExam']);

    await TestBed.configureTestingModule({
      imports: [
        CreateExamPageComponent,
        ReactiveFormsModule,
        LayoutComponent,
        HeaderComponent,
        FooterComponent
      ],
      providers: [
        FormBuilder,
        { provide: Router, useValue: mockRouter },
        { provide: ExamsService, useValue: mockExamsService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CreateExamPageComponent);
    component = fixture.componentInstance;

    // Setup service mocks
    mockExamsService.createExam.and.returnValue(of(mockExam));
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Component Initialization', () => {
    it('should initialize with selection mode', () => {
      expect(component.currentMode()).toBe('selection');
    });

    it('should initialize form with default values', () => {
      expect(component.examForm).toBeDefined();
      expect(component.examForm.get('title')?.value).toBe('');
      expect(component.examForm.get('timeLimit')?.value).toBe(60);
      expect(component.examForm.get('passingScore')?.value).toBe(70);
    });

    it('should initialize isSubmitting as false', () => {
      expect(component.isSubmitting()).toBe(false);
    });
  });

  describe('Mode Selection', () => {
    it('should select manual mode', () => {
      component.selectMode('manual');
      expect(component.currentMode()).toBe('manual');
    });

    it('should select pdf mode', () => {
      component.selectMode('pdf');
      expect(component.currentMode()).toBe('pdf');
    });

    it('should go back to selection mode from manual', () => {
      component.selectMode('manual');
      component.goBack();
      expect(component.currentMode()).toBe('selection');
    });

    it('should go back to selection mode from pdf', () => {
      component.selectMode('pdf');
      component.goBack();
      expect(component.currentMode()).toBe('selection');
    });

    it('should navigate to exams when going back from selection', () => {
      component.goBack();
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/exams']);
    });
  });

  describe('Form Validation', () => {
    beforeEach(() => {
      component.selectMode('manual');
      fixture.detectChanges();
    });

    it('should validate required title field', () => {
      component.examForm.patchValue({ title: '' });
      expect(component.examForm.get('title')?.invalid).toBe(true);
      expect(component.examForm.get('title')?.errors?.['required']).toBe(true);
    });

    it('should validate minimum title length', () => {
      component.examForm.patchValue({ title: 'ab' });
      expect(component.examForm.get('title')?.invalid).toBe(true);
      expect(component.examForm.get('title')?.errors?.['minlength']).toBeDefined();
    });

    it('should validate time limit range', () => {
      component.examForm.patchValue({ timeLimit: 0 });
      expect(component.examForm.get('timeLimit')?.invalid).toBe(true);

      component.examForm.patchValue({ timeLimit: 301 });
      expect(component.examForm.get('timeLimit')?.invalid).toBe(true);

      component.examForm.patchValue({ timeLimit: 60 });
      expect(component.examForm.get('timeLimit')?.valid).toBe(true);
    });

    it('should validate passing score range', () => {
      component.examForm.patchValue({ passingScore: 0 });
      expect(component.examForm.get('passingScore')?.invalid).toBe(true);

      component.examForm.patchValue({ passingScore: 101 });
      expect(component.examForm.get('passingScore')?.invalid).toBe(true);

      component.examForm.patchValue({ passingScore: 70 });
      expect(component.examForm.get('passingScore')?.valid).toBe(true);
    });

    it('should validate required passing score field', () => {
      component.examForm.patchValue({ passingScore: null });
      expect(component.examForm.get('passingScore')?.invalid).toBe(true);
      expect(component.examForm.get('passingScore')?.errors?.['required']).toBe(true);
    });
  });

  describe('Form Submission', () => {
    beforeEach(() => {
      component.selectMode('manual');
      fixture.detectChanges();
    });

    it('should not submit when form is invalid', async () => {
      component.examForm.patchValue({ title: '' }); // Invalid form

      await component.onSubmit();

      expect(mockExamsService.createExam).not.toHaveBeenCalled();
      expect(component.examForm.get('title')?.touched).toBe(true);
    });

    it('should submit valid form successfully', async () => {
      component.examForm.patchValue({
        title: 'Test Exam',
        description: 'Test Description',
        timeLimit: 90,
        passingScore: 80
      });

      await component.onSubmit();

      expect(mockExamsService.createExam).toHaveBeenCalledWith({
        title: 'Test Exam',
        description: 'Test Description',
        timeLimit: 90,
        passingScore: 80
      });

      expect(mockRouter.navigate).toHaveBeenCalledWith(['/exams', 1, 'questions', 'create']);
    });

    it('should handle undefined optional fields', async () => {
      component.examForm.patchValue({
        title: 'Test Exam',
        description: '',
        timeLimit: null,
        passingScore: 70
      });

      await component.onSubmit();

      expect(mockExamsService.createExam).toHaveBeenCalledWith({
        title: 'Test Exam',
        description: undefined,
        timeLimit: undefined,
        passingScore: 70
      });
    });

    it('should set submitting state during submission', async () => {
      component.examForm.patchValue({
        title: 'Test Exam',
        passingScore: 70
      });

      // Make the service call take some time
      mockExamsService.createExam.and.returnValue(new Promise(resolve => {
        setTimeout(() => resolve(mockExam), 100);
      }) as any);

      const submitPromise = component.onSubmit();

      expect(component.isSubmitting()).toBe(true);

      await submitPromise;

      expect(component.isSubmitting()).toBe(false);
    });

    it('should handle submission errors', async () => {
      component.examForm.patchValue({
        title: 'Test Exam',
        passingScore: 70
      });

      mockExamsService.createExam.and.returnValue(Promise.reject('Error') as any);
      spyOn(console, 'error');

      await component.onSubmit();

      expect(console.error).toHaveBeenCalledWith('Error creating exam:', 'Error');
      expect(component.isSubmitting()).toBe(false);
      expect(mockRouter.navigate).not.toHaveBeenCalled();
    });
  });

  describe('UI Interaction', () => {
    it('should display mode selection by default', () => {
      fixture.detectChanges();

      const modeSelection = fixture.nativeElement.querySelector('.mode-selection');
      expect(modeSelection).toBeTruthy();
    });

    it('should display manual creation form when manual mode is selected', () => {
      component.selectMode('manual');
      fixture.detectChanges();

      const manualCreation = fixture.nativeElement.querySelector('.manual-creation');
      const examForm = fixture.nativeElement.querySelector('.exam-form');

      expect(manualCreation).toBeTruthy();
      expect(examForm).toBeTruthy();
    });

    it('should display PDF upload section when pdf mode is selected', () => {
      component.selectMode('pdf');
      fixture.detectChanges();

      const pdfUpload = fixture.nativeElement.querySelector('.pdf-upload');
      const comingSoon = fixture.nativeElement.querySelector('.coming-soon-message');

      expect(pdfUpload).toBeTruthy();
      expect(comingSoon).toBeTruthy();
    });

    it('should disable submit button when form is invalid', () => {
      component.selectMode('manual');
      component.examForm.patchValue({ title: '' }); // Invalid
      fixture.detectChanges();

      const submitButton = fixture.nativeElement.querySelector('button[type="submit"]');
      expect(submitButton.disabled).toBe(true);
    });

    it('should enable submit button when form is valid', () => {
      component.selectMode('manual');
      component.examForm.patchValue({
        title: 'Valid Title',
        passingScore: 70
      });
      fixture.detectChanges();

      const submitButton = fixture.nativeElement.querySelector('button[type="submit"]');
      expect(submitButton.disabled).toBe(false);
    });

    it('should show loading state during submission', () => {
      component.selectMode('manual');
      component.isSubmitting.set(true);
      fixture.detectChanges();

      const submitButton = fixture.nativeElement.querySelector('button[type="submit"]');
      const loadingSpinner = fixture.nativeElement.querySelector('.loading-spinner');

      expect(submitButton.disabled).toBe(true);
      expect(loadingSpinner).toBeTruthy();
      expect(submitButton.textContent).toContain('Creando...');
    });
  });

  describe('Navigation Integration', () => {
    it('should navigate back to exams list from selection mode', () => {
      component.goBack();
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/exams']);
    });

    it('should return to selection mode from manual mode', () => {
      component.selectMode('manual');
      component.goBack();
      expect(component.currentMode()).toBe('selection');
      expect(mockRouter.navigate).not.toHaveBeenCalled();
    });

    it('should navigate to questions creation after successful exam creation', async () => {
      component.selectMode('manual');
      component.examForm.patchValue({
        title: 'Test Exam',
        passingScore: 70
      });

      await component.onSubmit();

      expect(mockRouter.navigate).toHaveBeenCalledWith(['/exams', 1, 'questions', 'create']);
    });
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { CreateExamCtaComponent } from './create-exam-cta.component';

describe('CreateExamCtaComponent', () => {
  let component: CreateExamCtaComponent;
  let fixture: ComponentFixture<CreateExamCtaComponent>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [CreateExamCtaComponent],
      providers: [
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CreateExamCtaComponent);
    component = fixture.componentInstance;
    mockRouter = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to create exam page when button is clicked', () => {
    component.navigateToCreateExam();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/exams/create']);
  });

  it('should render the correct title and subtitle', () => {
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.querySelector('.cta-title')?.textContent?.trim())
      .toBe('¿Listo para crear tu próximo examen?');

    expect(compiled.querySelector('.cta-subtitle')?.textContent?.trim())
      .toBe('Crea exámenes personalizados en minutos con nuestro intuitivo creador');
  });

  it('should have proper accessibility attributes', () => {
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;

    const section = compiled.querySelector('section');
    expect(section?.getAttribute('aria-labelledby')).toBe('cta-title');

    const button = compiled.querySelector('button');
    expect(button?.getAttribute('aria-describedby')).toBe('create-btn-desc');

    const icons = compiled.querySelectorAll('[aria-hidden="true"]');
    expect(icons.length).toBeGreaterThan(0);
  });

  it('should call navigateToCreateExam when button is clicked', () => {
    spyOn(component, 'navigateToCreateExam');
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('button');
    button?.click();

    expect(component.navigateToCreateExam).toHaveBeenCalled();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PageTitleComponent } from './page-title.component';

describe('PageTitleComponent', () => {
  let component: PageTitleComponent;
  let fixture: ComponentFixture<PageTitleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PageTitleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PageTitleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display title when provided', () => {
    // Set inputs using component instance
    Object.defineProperty(component, 'title', {
      value: () => 'Test Title'
    });
    fixture.detectChanges();
    const titleElement = fixture.nativeElement.querySelector('.page-title');
    expect(titleElement.textContent).toContain('Test Title');
  });

  it('should display description when provided', () => {
    Object.defineProperty(component, 'title', {
      value: () => 'Test Title'
    });
    Object.defineProperty(component, 'description', {
      value: () => 'Test Description'
    });
    fixture.detectChanges();
    const descriptionElement = fixture.nativeElement.querySelector('.page-description');
    expect(descriptionElement.textContent).toContain('Test Description');
  });

  it('should not display description when empty', () => {
    Object.defineProperty(component, 'title', {
      value: () => 'Test Title'
    });
    Object.defineProperty(component, 'description', {
      value: () => ''
    });
    fixture.detectChanges();
    const descriptionElement = fixture.nativeElement.querySelector('.page-description');
    expect(descriptionElement).toBeNull();
  });

  it('should show back button by default', () => {
    Object.defineProperty(component, 'title', {
      value: () => 'Test Title'
    });
    fixture.detectChanges();
    const backButton = fixture.nativeElement.querySelector('.back-button');
    expect(backButton).toBeTruthy();
  });

  it('should hide back button when showBackButton is false', () => {
    Object.defineProperty(component, 'title', {
      value: () => 'Test Title'
    });
    Object.defineProperty(component, 'showBackButton', {
      value: () => false
    });
    fixture.detectChanges();
    const backButton = fixture.nativeElement.querySelector('.back-button');
    expect(backButton).toBeNull();
  });

  it('should emit backClick when back button is clicked', () => {
    spyOn(component.backClick, 'emit');
    Object.defineProperty(component, 'title', {
      value: () => 'Test Title'
    });
    fixture.detectChanges();
    const backButton = fixture.nativeElement.querySelector('.back-button');
    backButton.click();
    expect(component.backClick.emit).toHaveBeenCalled();
  });

  it('should use custom back button text', () => {
    Object.defineProperty(component, 'title', {
      value: () => 'Test Title'
    });
    Object.defineProperty(component, 'backButtonText', {
      value: () => 'Go Back'
    });
    fixture.detectChanges();
    const backButton = fixture.nativeElement.querySelector('.back-button');
    expect(backButton.textContent.trim()).toContain('Go Back');
  });
});

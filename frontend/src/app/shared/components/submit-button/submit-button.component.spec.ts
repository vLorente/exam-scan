import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { By } from '@angular/platform-browser';

import { SubmitButtonComponent } from './submit-button.component';

describe('SubmitButtonComponent', () => {
  let component: SubmitButtonComponent;
  let fixture: ComponentFixture<SubmitButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        SubmitButtonComponent,
        MatButtonModule,
        MatIconModule,
        MatProgressSpinnerModule
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubmitButtonComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.componentRef.setInput('text', 'Submit');
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should display the provided text', () => {
    fixture.componentRef.setInput('text', 'Save Changes');
    fixture.detectChanges();

    const button = fixture.debugElement.query(By.css('button'));
    expect(button.nativeElement.textContent.trim()).toContain('Save Changes');
  });

  it('should show loading state when loading is true', () => {
    fixture.componentRef.setInput('text', 'Submit');
    fixture.componentRef.setInput('loading', true);
    fixture.componentRef.setInput('loadingText', 'Saving...');
    fixture.detectChanges();

    const spinner = fixture.debugElement.query(By.css('mat-progress-spinner'));
    const button = fixture.debugElement.query(By.css('button'));

    expect(spinner).toBeTruthy();
    expect(button.nativeElement.textContent.trim()).toContain('Saving...');
  });

  it('should be disabled when disabled input is true', () => {
    fixture.componentRef.setInput('text', 'Submit');
    fixture.componentRef.setInput('disabled', true);
    fixture.detectChanges();

    const button = fixture.debugElement.query(By.css('button'));
    expect(button.nativeElement.disabled).toBe(true);
  });

  it('should be disabled when loading is true', () => {
    fixture.componentRef.setInput('text', 'Submit');
    fixture.componentRef.setInput('loading', true);
    fixture.detectChanges();

    const button = fixture.debugElement.query(By.css('button'));
    expect(button.nativeElement.disabled).toBe(true);
  });

  it('should display icon when provided', () => {
    fixture.componentRef.setInput('text', 'Login');
    fixture.componentRef.setInput('icon', 'login');
    fixture.detectChanges();

    const icon = fixture.debugElement.query(By.css('mat-icon'));
    expect(icon).toBeTruthy();
    expect(icon.nativeElement.textContent.trim()).toBe('login');
  });

  it('should emit onClick when button is clicked', () => {
    spyOn(component.onClick, 'emit');

    fixture.componentRef.setInput('text', 'Submit');
    fixture.detectChanges();

    const button = fixture.debugElement.query(By.css('button'));
    button.nativeElement.click();

    expect(component.onClick.emit).toHaveBeenCalled();
  });

  it('should have submit-button class', () => {
    fixture.componentRef.setInput('text', 'Submit');
    fixture.detectChanges();

    const button = fixture.debugElement.query(By.css('button'));
    expect(button.nativeElement.classList).toContain('submit-button');
  });

  it('should have correct type attribute', () => {
    fixture.componentRef.setInput('text', 'Submit');
    fixture.detectChanges();

    const button = fixture.debugElement.query(By.css('button'));
    expect(button.nativeElement.type).toBe('submit');
  });

  it('should include accessibility descriptions when provided', () => {
    fixture.componentRef.setInput('text', 'Submit');
    fixture.componentRef.setInput('description', 'Submit the form');
    fixture.componentRef.setInput('descriptionId', 'submit-desc');
    fixture.detectChanges();

    const button = fixture.debugElement.query(By.css('button'));
    const description = fixture.debugElement.query(By.css('#submit-desc'));

    expect(button.nativeElement.getAttribute('aria-describedby')).toBe('submit-desc');
    expect(description).toBeTruthy();
    expect(description.nativeElement.textContent.trim()).toBe('Submit the form');
  });
});

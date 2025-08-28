import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FooterComponent } from './footer';

describe('FooterComponent', () => {
  let component: FooterComponent;
  let fixture: ComponentFixture<FooterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FooterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display current year', () => {
    const currentYear = new Date().getFullYear();
    expect(component.currentYear).toBe(currentYear);
  });

  it('should show default app name', () => {
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('.brand-name')?.textContent).toContain('ExamScan');
  });

  it('should show custom app name when provided', () => {
    fixture.componentRef.setInput('appName', 'Custom App');
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('.brand-name')?.textContent).toContain('Custom App');
  });

  it('should hide links when showLinks is false', () => {
    fixture.componentRef.setInput('showLinks', false);
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('.footer-links')).toBeFalsy();
  });

  it('should show links by default', () => {
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('.footer-links')).toBeTruthy();
  });
});

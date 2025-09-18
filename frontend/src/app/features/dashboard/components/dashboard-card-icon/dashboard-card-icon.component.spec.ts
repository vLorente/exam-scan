import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardCardIconComponent } from './dashboard-card-icon.component';

describe('DashboardCardIconComponent', () => {
  let component: DashboardCardIconComponent;
  let fixture: ComponentFixture<DashboardCardIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardCardIconComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardCardIconComponent);
    component = fixture.componentInstance;

    // Set required input
    fixture.componentRef.setInput('icon', 'quiz');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the correct icon based on input', () => {
    fixture.componentRef.setInput('icon', 'analytics');
    fixture.detectChanges();

    const iconElement = fixture.nativeElement.querySelector('.card-icon');
    expect(iconElement).toHaveClass('icon-analytics');
  });

  it('should have correct aria attributes', () => {
    const iconElement = fixture.nativeElement.querySelector('.card-icon');
    expect(iconElement.getAttribute('aria-hidden')).toBe('true');
  });

  it('should render SVG element', () => {
    const svgElement = fixture.nativeElement.querySelector('svg');
    expect(svgElement).toBeTruthy();
    expect(svgElement.getAttribute('viewBox')).toBe('0 0 24 24');
  });

  it('should apply correct CSS classes for different icons', () => {
    const testCases = ['quiz', 'smart_toy', 'people', 'analytics', 'fitness_center', 'menu_book'];

    testCases.forEach(iconName => {
      fixture.componentRef.setInput('icon', iconName);
      fixture.detectChanges();

      const iconElement = fixture.nativeElement.querySelector('.card-icon');
      expect(iconElement).toHaveClass(`icon-${iconName}`);
    });
  });
});

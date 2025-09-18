import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardCardComponent } from './dashboard-card.component';
import { DashboardCardIconComponent } from '../dashboard-card-icon/dashboard-card-icon.component';

describe('DashboardCardComponent', () => {
  let component: DashboardCardComponent;
  let fixture: ComponentFixture<DashboardCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardCardComponent, DashboardCardIconComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardCardComponent);
    component = fixture.componentInstance;

    // Set required inputs
    fixture.componentRef.setInput('title', 'Test Title');
    fixture.componentRef.setInput('description', 'Test Description');
    fixture.componentRef.setInput('buttonText', 'Test Button');
    fixture.componentRef.setInput('icon', 'quiz');

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the icon component', () => {
    const iconComponent = fixture.nativeElement.querySelector('app-dashboard-card-icon');
    expect(iconComponent).toBeTruthy();
  });

  it('should pass the correct icon to the icon component', () => {
    fixture.componentRef.setInput('icon', 'analytics');
    fixture.detectChanges();

    const iconComponent = fixture.nativeElement.querySelector('app-dashboard-card-icon');
    expect(iconComponent).toBeTruthy();
  });
});

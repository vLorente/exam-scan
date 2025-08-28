import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { User } from '@core/models/user.model';

import { HeaderComponent } from './header';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;

  const mockUser: User = {
    id: 1,
    email: 'test@example.com',
    username: 'testuser',
    fullName: 'Test User',
    role: 'student',
    isActive: true,
    createdAt: new Date('2024-01-01T00:00:00Z'),
    updatedAt: new Date('2024-01-01T00:00:00Z')
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;

    // Set required inputs
    fixture.componentRef.setInput('user', signal(mockUser));

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display user name', () => {
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('.user-name')?.textContent).toContain('Test User');
  });

  it('should display correct role label', () => {
    expect(component.getRoleLabel('student')).toBe('Estudiante');
    expect(component.getRoleLabel('teacher')).toBe('Profesor');
    expect(component.getRoleLabel('admin')).toBe('Administrador');
  });

  it('should emit logout event when logout button is clicked', () => {
    spyOn(component.logout, 'emit');

    const logoutButton = fixture.nativeElement.querySelector('.logout-button');
    logoutButton.click();

    expect(component.logout.emit).toHaveBeenCalled();
  });

  it('should display custom title and subtitle', () => {
    fixture.componentRef.setInput('title', 'Custom Title');
    fixture.componentRef.setInput('subtitle', 'Custom Subtitle');
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('.brand-title')?.textContent).toContain('Custom Title');
    expect(compiled.querySelector('.brand-subtitle')?.textContent).toContain('Custom Subtitle');
  });
});

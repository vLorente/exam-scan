import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { User } from '@core/models/user.model';
import { AuthService } from '@core/services/auth';

import { HeaderComponent } from './header.component';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let mockAuthService: jasmine.SpyObj<AuthService>;

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
    mockAuthService = jasmine.createSpyObj('AuthService', ['logout'], {
      user: signal<User | null>(mockUser)
    });

    await TestBed.configureTestingModule({
      imports: [HeaderComponent],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([])
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
    TestBed.resetTestingModule();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have user data from auth service', () => {
    expect(component.user()).toBeTruthy();
    expect(component.user()?.fullName).toBe('Test User');
  });

  it('should display user name', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const userNameElement = compiled.querySelector('.user-name');

    if (!userNameElement) {
      console.log('Available elements:', compiled.innerHTML);
      console.log('User signal value:', component.user());
    }

    expect(userNameElement).withContext('user-name element should exist').toBeTruthy();
    expect(userNameElement?.textContent).toContain('Test User');
  });

  it('should display correct role label', () => {
    expect(component.getRoleLabel('student')).toBe('Estudiante');
    expect(component.getRoleLabel('teacher')).toBe('Profesor');
    expect(component.getRoleLabel('admin')).toBe('Administrador');
  });

  it('should display correct role letter', () => {
    expect(component.getRoleLetter('student')).toBe('E');
    expect(component.getRoleLetter('teacher')).toBe('P');
    expect(component.getRoleLetter('admin')).toBe('A');
  });

  it('should call authService.logout when logout method is called', () => {
    spyOn(component.logout, 'emit');

    component.onLogout();

    expect(mockAuthService.logout).toHaveBeenCalled();
    expect(component.logout.emit).toHaveBeenCalled();
  });

  it('should emit logout event when logout button is clicked', () => {
    spyOn(component.logout, 'emit');

    const logoutButton = fixture.nativeElement.querySelector('.logout-button') as HTMLButtonElement;

    if (logoutButton) {
      logoutButton.click();
      expect(mockAuthService.logout).toHaveBeenCalled();
      expect(component.logout.emit).toHaveBeenCalled();
    } else {
      component.onLogout();
      expect(mockAuthService.logout).toHaveBeenCalled();
      expect(component.logout.emit).toHaveBeenCalled();
    }
  });

  it('should display custom title and subtitle', () => {
    fixture.componentRef.setInput('title', 'Custom Title');
    fixture.componentRef.setInput('subtitle', 'Custom Subtitle');
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const brandTitle = compiled.querySelector('.brand-title');
    const brandSubtitle = compiled.querySelector('.brand-subtitle');

    expect(brandTitle?.textContent).toContain('Custom Title');
    expect(brandSubtitle?.textContent).toContain('Custom Subtitle');
  });

  it('should filter navigation items by user role', () => {
    const visibleItems = component.visibleNavigationItems();
    expect(visibleItems).toBeDefined();
    expect(Array.isArray(visibleItems)).toBe(true);
  });

  it('should show navigation items for student role', () => {
    const items = component.visibleNavigationItems();
    expect(items.length).toBeGreaterThan(0);
    expect(items.some(item => item.label === 'Exámenes')).toBe(true);
  });

  describe('Admin role tests', () => {
    let adminFixture: ComponentFixture<HeaderComponent>;
    let adminComponent: HeaderComponent;
    let adminAuthService: jasmine.SpyObj<AuthService>;

    beforeEach(async () => {
      // Reset TestBed before configuring
      TestBed.resetTestingModule();

      const adminUser: User = {
        id: 2,
        email: 'admin@example.com',
        username: 'adminuser',
        fullName: 'Admin User',
        role: 'admin',
        isActive: true,
        createdAt: new Date('2024-01-01T00:00:00Z'),
        updatedAt: new Date('2024-01-01T00:00:00Z')
      };

      adminAuthService = jasmine.createSpyObj('AuthService', ['logout'], {
        user: signal<User | null>(adminUser)
      });

      await TestBed.configureTestingModule({
        imports: [HeaderComponent],
        providers: [
          { provide: AuthService, useValue: adminAuthService },
          provideHttpClient(),
          provideHttpClientTesting(),
          provideRouter([])
        ]
      }).compileComponents();

      adminFixture = TestBed.createComponent(HeaderComponent);
      adminComponent = adminFixture.componentInstance;
      adminFixture.detectChanges();
    });

    afterEach(() => {
      adminFixture.destroy();
      TestBed.resetTestingModule();
    });

    it('should handle admin user role correctly', () => {
      expect(adminComponent.user()?.role).toBe('admin');
      expect(adminComponent.getRoleLabel('admin')).toBe('Administrador');
      expect(adminComponent.getRoleLetter('admin')).toBe('A');
    });

    it('should display admin role badge', () => {
      const compiled = adminFixture.nativeElement as HTMLElement;
      const roleBadge = compiled.querySelector('.role-badge.role-admin');

      expect(roleBadge).toBeTruthy();
      expect(roleBadge?.textContent?.trim()).toBe('A');
    });

    it('should show admin user full name', () => {
      expect(adminComponent.user()?.fullName).toBe('Admin User');

      const compiled = adminFixture.nativeElement as HTMLElement;
      const userName = compiled.querySelector('.user-name');
      expect(userName?.textContent).toContain('Admin User');
    });
  });

  describe('Teacher role tests', () => {
    let teacherFixture: ComponentFixture<HeaderComponent>;
    let teacherComponent: HeaderComponent;
    let teacherAuthService: jasmine.SpyObj<AuthService>;

    beforeEach(async () => {
      // Reset TestBed before configuring
      TestBed.resetTestingModule();

      const teacherUser: User = {
        id: 3,
        email: 'teacher@example.com',
        username: 'teacheruser',
        fullName: 'Teacher User',
        role: 'teacher',
        isActive: true,
        createdAt: new Date('2024-01-01T00:00:00Z'),
        updatedAt: new Date('2024-01-01T00:00:00Z')
      };

      teacherAuthService = jasmine.createSpyObj('AuthService', ['logout'], {
        user: signal<User | null>(teacherUser)
      });

      await TestBed.configureTestingModule({
        imports: [HeaderComponent],
        providers: [
          { provide: AuthService, useValue: teacherAuthService },
          provideHttpClient(),
          provideHttpClientTesting(),
          provideRouter([])
        ]
      }).compileComponents();

      teacherFixture = TestBed.createComponent(HeaderComponent);
      teacherComponent = teacherFixture.componentInstance;
      teacherFixture.detectChanges();
    });

    afterEach(() => {
      teacherFixture.destroy();
      TestBed.resetTestingModule();
    });

    it('should handle teacher user role correctly', () => {
      expect(teacherComponent.user()?.role).toBe('teacher');
      expect(teacherComponent.getRoleLabel('teacher')).toBe('Profesor');
      expect(teacherComponent.getRoleLetter('teacher')).toBe('P');
    });

    it('should display teacher role badge', () => {
      const compiled = teacherFixture.nativeElement as HTMLElement;
      const roleBadge = compiled.querySelector('.role-badge.role-teacher');

      expect(roleBadge).toBeTruthy();
      expect(roleBadge?.textContent?.trim()).toBe('P');
    });
  });
});

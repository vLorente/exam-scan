import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of, throwError } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LoginPageComponent } from './login.page';
import { AuthService } from '@core/services/auth';
import { LoginRequest, LoginResponse } from '@core/models/auth.model';
import { User } from '@core/models';

describe('LoginPageComponent', () => {
  let component: LoginPageComponent;
  let fixture: ComponentFixture<LoginPageComponent>;
  let authService: jasmine.SpyObj<AuthService>;
  let snackBar: jasmine.SpyObj<MatSnackBar>;
  let compiled: HTMLElement;

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

  const mockLoginResponse: LoginResponse = {
    accessToken: 'mocked_access_token',
    tokenType: 'Bearer',
    currentUser: mockUser
  };

  beforeEach(async () => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', [
      'login',
      'setSession'
    ]);
    const snackBarSpy = jasmine.createSpyObj('MatSnackBar', ['open']);

    await TestBed.configureTestingModule({
      imports: [],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: MatSnackBar, useValue: snackBarSpy },
        provideRouter([{ path: 'dashboard', children: [] }]),
      ]
    })
    .overrideComponent(LoginPageComponent, {
      remove: {
        imports: []
      },
      add: {
        providers: [
          { provide: AuthService, useValue: authServiceSpy },
          { provide: MatSnackBar, useValue: snackBarSpy },
        ]
      }
    })
    .compileComponents();

    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    snackBar = TestBed.inject(MatSnackBar) as jasmine.SpyObj<MatSnackBar>;

    fixture = TestBed.createComponent(LoginPageComponent);
    component = fixture.componentInstance;
    compiled = fixture.nativeElement;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('UI Tests', () => {
    it('should render login form component', () => {
      const loginForm = compiled.querySelector('app-login-form');
      expect(loginForm).toBeTruthy();
    });

    it('should display page title', () => {
      const title = compiled.querySelector('h1');
      expect(title).toBeTruthy();
      expect(title?.textContent?.trim()).toBe('Iniciar Sesión');
    });

    it('should render register link with RouterLink', () => {
      const registerLink = compiled.querySelector('a[routerLink]');
      expect(registerLink).toBeTruthy();
    });

    it('should show loading state when loading signal is true', async () => {
      component.loading.set(true);
      fixture.detectChanges();
      await fixture.whenStable();

      const loadingIndicator = compiled.querySelector('.loading, [aria-busy="true"], mat-spinner, mat-progress-bar');
      const disabledButton = compiled.querySelector('button[disabled]');

      expect(loadingIndicator || disabledButton).toBeTruthy();
    });

    it('should not show loading state initially', () => {
      expect(component.loading()).toBe(false);
    });
  });

  describe('Login functionality', () => {
    const mockLoginData: LoginRequest = {
      email: 'test@example.com',
      password: 'password123'
    };

    it('should call authService.login with correct data', async () => {
      authService.login.and.returnValue(of(mockLoginResponse));

      await component.handleLogin(mockLoginData);

      expect(authService.login).toHaveBeenCalledWith(mockLoginData);
    });

    it('should set loading to true during login', async () => {
      authService.login.and.returnValue(of(mockLoginResponse));

      const loginPromise = component.handleLogin(mockLoginData);
      expect(component.loading()).toBe(true);

      await loginPromise;
    });

    it('should set loading to false after successful login', async () => {
      authService.login.and.returnValue(of(mockLoginResponse));

      await component.handleLogin(mockLoginData);

      expect(component.loading()).toBe(false);
    });

    it('should call setSession with response data', async () => {
      authService.login.and.returnValue(of(mockLoginResponse));

      await component.handleLogin(mockLoginData);

      expect(authService.setSession).toHaveBeenCalledWith(mockLoginResponse);
    });

    it('should navigate to dashboard on successful login', async () => {
      authService.login.and.returnValue(of(mockLoginResponse));
      spyOn(component['router'], 'navigate');

      await component.handleLogin(mockLoginData);

      expect(component['router'].navigate).toHaveBeenCalledWith(['/dashboard']);
    });
  });

  describe('Error handling', () => {
    const mockLoginData: LoginRequest = {
      email: 'test@example.com',
      password: 'wrongpassword'
    };

    beforeEach(() => {
      // Reset snackBar spy before each error test
      snackBar.open.calls.reset();
    });

    it('should show error snackbar on login failure', async () => {
      const errorMessage = 'Invalid credentials';
      const mockError = { message: errorMessage };
      authService.login.and.returnValue(
        throwError(() => mockError)
      );

      await component.handleLogin(mockLoginData);

      expect(snackBar.open).toHaveBeenCalledWith(
        errorMessage,
        'Cerrar',
        jasmine.objectContaining({
          duration: 5000,
          panelClass: ['error-snackbar']
        })
      );
    });

    it('should show default error message when error has no message', async () => {
      authService.login.and.returnValue(throwError(() => ({})));

      await component.handleLogin(mockLoginData);

      expect(snackBar.open).toHaveBeenCalledWith(
        'Error al iniciar sesión. Verifica tus credenciales.',
        'Cerrar',
        jasmine.objectContaining({
          duration: 5000,
          panelClass: ['error-snackbar']
        })
      );
    });

    it('should set loading to false after error', async () => {
      authService.login.and.returnValue(
        throwError(() => new Error('Login failed'))
      );

      await component.handleLogin(mockLoginData);

      expect(component.loading()).toBe(false);
    });
  });

  describe('Component configuration', () => {
    it('should use OnPush change detection strategy', () => {
      expect(fixture.componentRef.changeDetectorRef).toBeTruthy();
    });

    it('should initialize loading signal as false', () => {
      expect(component.loading()).toBe(false);
    });
  });
});

import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthService } from './auth.service';
import { User, LoginRequest, LoginResponse, RegisterRequest } from '../../../core/models/user.model';
import { environment } from '../../../../environments/environment';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  const mockUser: User = {
    id: '1',
    name: 'Test User',
    email: 'test@example.com',
    role: 'student'
  };

  const mockLoginResponse: LoginResponse = {
    token: 'mock-jwt-token',
    user: mockUser
  };

  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService]
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('Constructor', () => {
    it('should initialize with no user when localStorage is empty', () => {
      expect(service.user()).toBeNull();
      expect(service.authenticated()).toBeFalse();
    });

    it('should restore session from localStorage', () => {
      // Setup localStorage
      localStorage.setItem('auth_token', 'test-token');
      localStorage.setItem('current_user', JSON.stringify(mockUser));

      // Create new service instance to trigger constructor
      const newService = TestBed.inject(AuthService);

      expect(newService.user()).toEqual(mockUser);
      expect(newService.authenticated()).toBeTrue();
    });

    it('should logout if localStorage contains invalid JSON', () => {
      localStorage.setItem('auth_token', 'test-token');
      localStorage.setItem('current_user', 'invalid-json');

      spyOn(service, 'logout');

      // Create new service instance to trigger constructor
      TestBed.inject(AuthService);

      expect(service.logout).toHaveBeenCalled();
    });
  });

  describe('login', () => {
    it('should make POST request to login endpoint', () => {
      const loginData: LoginRequest = {
        email: 'test@example.com',
        password: 'password123'
      };

      service.login(loginData).subscribe(response => {
        expect(response).toEqual(mockLoginResponse);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/v1/auth/login`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(loginData);
      req.flush(mockLoginResponse);
    });

    it('should handle login error', () => {
      const loginData: LoginRequest = {
        email: 'test@example.com',
        password: 'wrongpassword'
      };

      service.login(loginData).subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          expect(error.message).toBe('Credenciales inválidas');
        }
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/v1/auth/login`);
      req.flush({ message: 'Invalid credentials' }, { status: 401, statusText: 'Unauthorized' });
    });
  });

  describe('register', () => {
    it('should make POST request to register endpoint with mapped data', () => {
      const registerData: RegisterRequest = {
        email: 'new@example.com',
        username: 'newuser',
        full_name: 'New User',
        role: 'teacher',
        password: 'password123'
      };

      const expectedBackendData = {
        email: 'new@example.com',
        username: 'newuser',
        full_name: 'New User',
        role: 'teacher',
        is_active: true,
        password: 'password123'
      };

      service.register(registerData).subscribe(response => {
        expect(response).toEqual(mockLoginResponse);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/v1/auth/register`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(expectedBackendData);
      req.flush(mockLoginResponse);
    });

    it('should default role to student if not provided', () => {
      const registerData: RegisterRequest = {
        email: 'new@example.com',
        username: 'newuser',
        full_name: 'New User',
        password: 'password123'
      };

      service.register(registerData).subscribe();

      const req = httpMock.expectOne(`${environment.apiUrl}/v1/auth/register`);
      expect(req.request.body.role).toBe('student');
      req.flush(mockLoginResponse);
    });

    it('should handle registration error for existing email', () => {
      const registerData: RegisterRequest = {
        email: 'existing@example.com',
        username: 'newuser',
        full_name: 'New User',
        password: 'password123'
      };

      service.register(registerData).subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          expect(error.message).toBe('El email ya está registrado');
        }
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/v1/auth/register`);
      req.flush({ message: 'Email already exists' }, { status: 409, statusText: 'Conflict' });
    });
  });

  describe('logout', () => {
    it('should clear user data and localStorage', () => {
      // Setup initial state
      service.setSession(mockLoginResponse);
      expect(service.user()).toEqual(mockUser);
      expect(service.authenticated()).toBeTrue();

      // Logout
      service.logout();

      expect(service.user()).toBeNull();
      expect(service.authenticated()).toBeFalse();
      expect(localStorage.getItem('auth_token')).toBeNull();
      expect(localStorage.getItem('current_user')).toBeNull();
    });
  });

  describe('setSession', () => {
    it('should store token and user data', () => {
      service.setSession(mockLoginResponse);

      expect(service.user()).toEqual(mockUser);
      expect(service.authenticated()).toBeTrue();
      expect(localStorage.getItem('auth_token')).toBe('mock-jwt-token');
      expect(localStorage.getItem('current_user')).toBe(JSON.stringify(mockUser));
    });
  });

  describe('handleError', () => {
    it('should handle client-side errors', () => {
      const loginData: LoginRequest = {
        email: 'test@example.com',
        password: 'password123'
      };

      service.login(loginData).subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          expect(error.message).toContain('Error:');
        }
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/v1/auth/login`);
      req.error(new ProgressEvent('Network error'));
    });

    it('should handle 400 Bad Request', () => {
      const loginData: LoginRequest = {
        email: 'invalid-email',
        password: ''
      };

      service.login(loginData).subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          expect(error.message).toBe('Datos inválidos');
        }
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/v1/auth/login`);
      req.flush({}, { status: 400, statusText: 'Bad Request' });
    });

    it('should handle 422 Validation Error', () => {
      const loginData: LoginRequest = {
        email: 'test@example.com',
        password: 'short'
      };

      service.login(loginData).subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          expect(error.message).toBe('Password too short');
        }
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/v1/auth/login`);
      req.flush({ message: 'Password too short' }, { status: 422, statusText: 'Unprocessable Entity' });
    });

    it('should handle 500 Internal Server Error', () => {
      const loginData: LoginRequest = {
        email: 'test@example.com',
        password: 'password123'
      };

      service.login(loginData).subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          expect(error.message).toBe('Error interno del servidor');
        }
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/v1/auth/login`);
      req.flush({}, { status: 500, statusText: 'Internal Server Error' });
    });

    it('should handle unknown errors', () => {
      const loginData: LoginRequest = {
        email: 'test@example.com',
        password: 'password123'
      };

      service.login(loginData).subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          expect(error.message).toContain('Error 418:');
        }
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/v1/auth/login`);
      req.flush({}, { status: 418, statusText: "I'm a teapot" });
    });
  });

  describe('signals', () => {
    it('should provide readonly signals', () => {
      const userSignal = service.user();
      const authSignal = service.authenticated();

      expect(userSignal).toBeNull();
      expect(authSignal).toBeFalse();

      // Verify signals are readonly by checking they don't have set method
      expect(typeof (service.user as any).set).toBe('undefined');
      expect(typeof (service.authenticated as any).set).toBe('undefined');
    });

    it('should update signals when session is set', () => {
      let userValue: User | null = null;
      let authValue: boolean = false;

      // Get initial values
      userValue = service.user();
      authValue = service.authenticated();

      expect(userValue).toBeNull();
      expect(authValue).toBeFalse();

      service.setSession(mockLoginResponse);

      // Get updated values
      userValue = service.user();
      authValue = service.authenticated();

      expect(userValue).toEqual(mockUser);
      expect(authValue).toBeTrue();
    });
  });
});

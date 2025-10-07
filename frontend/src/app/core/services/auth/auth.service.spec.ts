import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { AuthService } from './auth.service';
import { User, UserMapper } from '@core/models/user.model';
import { LoginRequest, LoginResponse, RegisterRequest, AuthMapper } from '@core/models/auth.model';
import { environment } from '@environments/environment';
import { provideHttpClient } from '@angular/common/http';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  const mockUser: User = {
    id: 1,
    email: 'test@example.com',
    username: 'testuser',
    fullName: 'Test User',
    role: 'student',
    isActive: true,
    createdAt: new Date('2025-08-28T09:12:08.129Z'),
    updatedAt: new Date('2025-08-28T09:12:08.129Z')
  };

  const mockLoginResponse: LoginResponse = {
    accessToken: 'mock-jwt-token',
    tokenType: 'bearer',
    currentUser: mockUser
  };

  // Helper to create API response from domain LoginResponse
  const createMockApiResponse = () => ({
    access_token: mockLoginResponse.accessToken,
    token_type: mockLoginResponse.tokenType,
    current_user: UserMapper.toApi(mockLoginResponse.currentUser)
  });

  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [
        AuthService,
        provideHttpClient(),
        provideHttpClientTesting(),
      ]
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
    let testService: AuthService;

    beforeEach(() => {
      // Reset TestBed for constructor tests to get fresh instances
      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        providers: [
          AuthService,
          provideHttpClient(),
          provideHttpClientTesting(),
        ]
      });
    });

    afterEach(() => {
      // Clean up localStorage after each constructor test
      localStorage.clear();
    });

    it('should initialize with no user when localStorage is empty', () => {
      testService = TestBed.inject(AuthService);

      expect(testService.user()).toBeNull();
      expect(testService.authenticated()).toBeFalse();
    });

    it('should restore session from localStorage', () => {
      // Setup localStorage before creating service
      localStorage.setItem('access_token', 'test-token');
      localStorage.setItem('current_user', JSON.stringify(mockUser));

      // Create new service instance to trigger constructor
      testService = TestBed.inject(AuthService);

      // When restoring from localStorage, dates are strings, not Date objects
      const expectedUser = {
        ...mockUser,
        createdAt: mockUser.createdAt.toISOString(),
        updatedAt: mockUser.updatedAt.toISOString()
      };

      expect(testService.user()).toEqual(expectedUser as any);
      expect(testService.authenticated()).toBeTrue();
    });

    it('should logout if localStorage contains invalid JSON', () => {
      localStorage.setItem('access_token', 'test-token');
      localStorage.setItem('current_user', 'invalid-json');

      // Spy on the prototype before creating the new instance
      const logoutSpy = spyOn(AuthService.prototype, 'logout');

      // Create new service instance to trigger constructor
      testService = TestBed.inject(AuthService);

      expect(logoutSpy).toHaveBeenCalled();
    });
  });

  describe('login', () => {
    it('should make POST request to login endpoint', () => {
      const loginData: LoginRequest = {
        email: 'test@example.com',
        password: 'password123'
      };

      service.login(loginData).subscribe((response: LoginResponse) => {
        expect(response).toEqual(mockLoginResponse);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/v1/auth/login`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(loginData);
      req.flush(createMockApiResponse());
    });

    it('should handle login error', () => {
      const loginData: LoginRequest = {
        email: 'test@example.com',
        password: 'wrongpassword'
      };

      service.login(loginData).subscribe({
        next: () => fail('should have failed'),
        error: (error: any) => {
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
        fullName: 'New User',
        role: 'teacher',
        password: 'password123'
      };

      const expectedBackendData = AuthMapper.registerRequestToApi(registerData);

      service.register(registerData).subscribe((response: LoginResponse) => {
        expect(response).toEqual(mockLoginResponse);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/v1/auth/register`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(expectedBackendData);
      req.flush(createMockApiResponse());
    });

    it('should default role to student if not provided', () => {
      const registerData: RegisterRequest = {
        email: 'new@example.com',
        username: 'newuser',
        fullName: 'New User',
        password: 'password123'
      };

      service.register(registerData).subscribe();

      const req = httpMock.expectOne(`${environment.apiUrl}/v1/auth/register`);
      expect(req.request.body.role).toBe('student');
      req.flush(createMockApiResponse());
    });

    it('should handle registration error for existing email', () => {
      const registerData: RegisterRequest = {
        email: 'existing@example.com',
        username: 'newuser',
        fullName: 'New User',
        password: 'password123'
      };

      service.register(registerData).subscribe({
        next: () => fail('should have failed'),
        error: (error: Error) => {
          expect(error.message).toBe('El email ya está registrado');
        }
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/v1/auth/register`);
      expect(req.request.method).toBe('POST');
      req.flush({ message: 'Email already exists' }, { status: 409, statusText: 'Conflict' });
    });
  });

  describe('logout', () => {
    afterEach(() => {
      // Ensure clean state after logout tests
      localStorage.clear();
    });

    it('should clear user data and localStorage', () => {
      // Setup initial state
      service.setSession(mockLoginResponse);
      expect(service.user()).toEqual(mockUser);
      expect(service.authenticated()).toBeTrue();

      // Logout
      service.logout();

      expect(service.user()).toBeNull();
      expect(service.authenticated()).toBeFalse();
      expect(localStorage.getItem('access_token')).toBeNull();
      expect(localStorage.getItem('current_user')).toBeNull();
    });
  });

  describe('setSession', () => {
    afterEach(() => {
      // Clean localStorage after setSession tests
      localStorage.clear();
    });

    it('should store token and user data', () => {
      service.setSession(mockLoginResponse);

      expect(service.user()).toEqual(mockUser);
      expect(service.authenticated()).toBeTrue();
      expect(localStorage.getItem('access_token')).toBe('mock-jwt-token');
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
        error: (error: Error) => {
          expect(error.message).toContain('Error:');
        }
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/v1/auth/login`);
      // Simulate a client-side/network error
      req.error(new ProgressEvent('error'));
    });

    it('should handle 400 Bad Request', () => {
      const loginData: LoginRequest = {
        email: 'invalid-email',
        password: ''
      };

      service.login(loginData).subscribe({
        next: () => fail('should have failed'),
        error: (error: any) => {
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
        error: (error: any) => {
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
        error: (error: any) => {
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
        error: (error: any) => {
          expect(error.message).toContain('Error 418:');
        }
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/v1/auth/login`);
      req.flush({}, { status: 418, statusText: "I'm a teapot" });
    });
  });

  describe('signals', () => {
    afterEach(() => {
      // Reset service state after signals tests
      service.logout();
    });

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

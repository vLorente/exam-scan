import { Injectable, signal, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, catchError } from 'rxjs';
import { User, LoginRequest, LoginResponse, RegisterRequest } from '../models/user.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private readonly API_URL = environment.apiUrl;

  private currentUser = signal<User | null>(null);
  private isAuthenticated = signal<boolean>(false);

  constructor() {
    // Check for existing session
    const token = localStorage.getItem('auth_token');
    const userStr = localStorage.getItem('current_user');
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        this.currentUser.set(user);
        this.isAuthenticated.set(true);
      } catch {
        this.logout();
      }
    }
  }

  get user() {
    return this.currentUser.asReadonly();
  }

  get authenticated() {
    return this.isAuthenticated.asReadonly();
  }

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.API_URL}/v1/auth/login`, credentials)
      .pipe(
        catchError(this.handleError)
      );
  }

  register(userData: RegisterRequest): Observable<LoginResponse> {
    // Mapear los datos del frontend al formato esperado por el backend
    const backendData = {
      email: userData.email,
      username: userData.username,
      full_name: userData.full_name,
      role: userData.role || 'student',
      is_active: true,
      password: userData.password
    };

    return this.http.post<LoginResponse>(`${this.API_URL}/v1/auth/register`, backendData)
      .pipe(
        catchError(this.handleError)
      );
  }

  logout(): void {
    this.currentUser.set(null);
    this.isAuthenticated.set(false);
    localStorage.removeItem('auth_token');
    localStorage.removeItem('current_user');
  }

  setSession(response: LoginResponse): void {
    localStorage.setItem('auth_token', response.token);
    localStorage.setItem('current_user', JSON.stringify(response.user));
    this.currentUser.set(response.user);
    this.isAuthenticated.set(true);
  }

  private handleError = (error: HttpErrorResponse): Observable<never> => {
    let errorMessage = 'Ha ocurrido un error inesperado';

    if (error.error instanceof ErrorEvent) {
      // Error del lado del cliente
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Error del servidor
      switch (error.status) {
        case 400:
          errorMessage = error.error?.message || 'Datos inválidos';
          break;
        case 401:
          errorMessage = 'Credenciales inválidas';
          break;
        case 409:
          errorMessage = 'El email ya está registrado';
          break;
        case 422:
          errorMessage = error.error?.message || 'Error de validación';
          break;
        case 500:
          errorMessage = 'Error interno del servidor';
          break;
        default:
          errorMessage = `Error ${error.status}: ${error.error?.message || 'Error desconocido'}`;
      }
    }

    return throwError(() => new Error(errorMessage));
  };
}

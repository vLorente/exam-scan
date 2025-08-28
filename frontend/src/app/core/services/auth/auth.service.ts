import { Injectable, signal, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, catchError, map } from 'rxjs';
import { User } from '../../models/user.model';
import {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  LoginApiResponse,
  AuthMapper
} from '@core/models/auth.model';
import { environment } from '@environments/environment';@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private readonly API_URL = environment.apiUrl;

  private currentUser = signal<User | null>(null);
  private isAuthenticated = signal<boolean>(false);

  constructor() {
    // Check for existing session
    const token = localStorage.getItem('access_token');
    const userStr = localStorage.getItem('current_user');
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr) as User;
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

  get accessToken(): string | null {
    return localStorage.getItem('access_token');
  }

  get tokenType(): string | null {
    return localStorage.getItem('token_type');
  }

  get authorizationHeader(): string | null {
    const token = this.accessToken;
    const type = this.tokenType;
    return token && type ? `${type} ${token}` : null;
  }

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginApiResponse>(`${this.API_URL}/v1/auth/login`, credentials)
      .pipe(
        map(apiResponse => AuthMapper.loginResponseFromApi(apiResponse)),
        catchError(this.handleError)
      );
  }

  register(userData: RegisterRequest): Observable<LoginResponse> {
    const apiRequest = AuthMapper.registerRequestToApi(userData);

    return this.http.post<LoginApiResponse>(`${this.API_URL}/v1/auth/register`, apiRequest)
      .pipe(
        map(apiResponse => AuthMapper.loginResponseFromApi(apiResponse)),
        catchError(this.handleError)
      );
  }

  logout(): void {
    this.currentUser.set(null);
    this.isAuthenticated.set(false);
    localStorage.removeItem('access_token');
    localStorage.removeItem('token_type');
    localStorage.removeItem('current_user');
  }

  setSession(response: LoginResponse): void {
    localStorage.setItem('access_token', response.accessToken);
    localStorage.setItem('token_type', response.tokenType);
    localStorage.setItem('current_user', JSON.stringify(response.currentUser));
    this.currentUser.set(response.currentUser);
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

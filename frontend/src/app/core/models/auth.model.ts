import { User, UserApiResponse, UserMapper } from './user.model';

// ==========================================
// AUTH API INTERFACES (snake_case)
// ==========================================

export interface LoginApiRequest {
  email: string;
  password: string;
}

export interface LoginApiResponse {
  access_token: string;
  token_type: string;
  current_user: UserApiResponse;
}

export interface RegisterApiRequest {
  email: string;
  username: string;
  full_name: string;
  role?: 'admin' | 'teacher' | 'student';
  password: string;
}

// ==========================================
// AUTH DOMAIN INTERFACES (camelCase)
// ==========================================

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  tokenType: string;
  currentUser: User;
}

export interface RegisterRequest {
  email: string;
  username: string;
  fullName: string;
  role?: 'admin' | 'teacher' | 'student';
  password: string;
}

// ==========================================
// AUTH MAPPERS
// ==========================================

export class AuthMapper {
  /**
   * Convierte la respuesta de login de la API (snake_case) a formato de dominio (camelCase)
   */
  static loginResponseFromApi(apiResponse: LoginApiResponse): LoginResponse {
    return {
      accessToken: apiResponse.access_token,
      tokenType: apiResponse.token_type,
      currentUser: UserMapper.fromApi(apiResponse.current_user)
    };
  }

  /**
   * Convierte los datos de registro del dominio (camelCase) a formato API (snake_case)
   */
  static registerRequestToApi(request: RegisterRequest): RegisterApiRequest {
    return {
      email: request.email,
      username: request.username,
      full_name: request.fullName,
      role: request.role,
      password: request.password
    };
  }

  /**
   * Convierte los datos de login del dominio a formato API (en este caso son iguales)
   */
  static loginRequestToApi(request: LoginRequest): LoginApiRequest {
    return {
      email: request.email,
      password: request.password
    };
  }
}

// ==========================================
// USER API INTERFACES (snake_case)
// ==========================================

export interface UserApiResponse {
  id: number;
  email: string;
  username: string;
  full_name: string;
  role: 'admin' | 'teacher' | 'student';
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// ==========================================
// USER DOMAIN INTERFACES (camelCase)
// ==========================================

export interface User {
  id: number;
  email: string;
  username: string;
  fullName: string;
  role: 'admin' | 'teacher' | 'student';
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// ==========================================
// USER MAPPERS
// ==========================================

export class UserMapper {
  /**
   * Convierte un usuario de la API (snake_case) a formato de dominio (camelCase)
   */
  static fromApi(apiUser: UserApiResponse): User {
    return {
      id: apiUser.id,
      email: apiUser.email,
      username: apiUser.username,
      fullName: apiUser.full_name,
      role: apiUser.role,
      isActive: apiUser.is_active,
      createdAt: new Date(apiUser.created_at),
      updatedAt: new Date(apiUser.updated_at)
    };
  }

  /**
   * Convierte un usuario del dominio (camelCase) a formato API (snake_case)
   */
  static toApi(user: Partial<User>): Partial<UserApiResponse> {
    return {
      id: user.id,
      email: user.email,
      username: user.username,
      full_name: user.fullName,
      role: user.role,
      is_active: user.isActive,
      created_at: user.createdAt?.toISOString(),
      updated_at: user.updatedAt?.toISOString()
    };
  }
}

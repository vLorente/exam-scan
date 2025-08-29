// ==========================================
// EXAM API INTERFACES (snake_case)
// ==========================================

export interface ExamApiResponse {
  id: number;
  title: string;
  description?: string;
  created_by: number;
  is_active: boolean;
  time_limit?: number; // in minutes
  total_questions: number;
  passing_score: number;
  created_at: string;
  updated_at: string;
}

export interface CreateExamApiRequest {
  title: string;
  description?: string;
  time_limit?: number;
  passing_score: number;
}

// ==========================================
// EXAM DOMAIN INTERFACES (camelCase)
// ==========================================

export interface Exam {
  id: number;
  title: string;
  description?: string;
  createdBy: number;
  isActive: boolean;
  timeLimit?: number; // in minutes
  totalQuestions: number;
  passingScore: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateExamRequest {
  title: string;
  description?: string;
  timeLimit?: number;
  passingScore: number;
}

// Student-specific interfaces for exam taking
export interface ExamAttempt {
  id: number;
  examId: number;
  studentId: number;
  score: number;
  isPassed: boolean;
  startedAt: Date;
  completedAt?: Date;
  timeSpent: number; // in minutes
}

// ==========================================
// EXAM MAPPERS
// ==========================================

export class ExamMapper {
  /**
   * Convierte un examen de la API (snake_case) a formato de dominio (camelCase)
   */
  static fromApi(apiExam: ExamApiResponse): Exam {
    return {
      id: apiExam.id,
      title: apiExam.title,
      description: apiExam.description,
      createdBy: apiExam.created_by,
      isActive: apiExam.is_active,
      timeLimit: apiExam.time_limit,
      totalQuestions: apiExam.total_questions,
      passingScore: apiExam.passing_score,
      createdAt: new Date(apiExam.created_at),
      updatedAt: new Date(apiExam.updated_at)
    };
  }

  /**
   * Convierte una solicitud de creación de examen del dominio a formato API
   */
  static createRequestToApi(request: CreateExamRequest): CreateExamApiRequest {
    return {
      title: request.title,
      description: request.description,
      time_limit: request.timeLimit,
      passing_score: request.passingScore
    };
  }
}

// ==========================================
// QUESTION API INTERFACES (snake_case)
// ==========================================

export interface QuestionApiResponse {
  id: number;
  exam_id: number;
  question_text: string;
  question_type: 'multiple_choice' | 'true_false' | 'short_answer' | 'single_choice';
  options?: string[]; // For multiple choice and single choice questions
  correct_answer: string | boolean;
  points: number;
  difficulty: 'easy' | 'medium' | 'hard';
  order_index: number;
  created_at: string;
  updated_at: string;
}

export interface CreateQuestionApiRequest {
  exam_id: number;
  question_text: string;
  question_type: 'multiple_choice' | 'true_false' | 'short_answer' | 'single_choice';
  options?: string[];
  correct_answer: string | boolean;
  points: number;
  difficulty: 'easy' | 'medium' | 'hard';
  order_index: number;
}

// ==========================================
// QUESTION DOMAIN INTERFACES (camelCase)
// ==========================================

export type QuestionType = 'multiple_choice' | 'true_false' | 'short_answer' | 'single_choice';

export interface Question {
  id: number;
  examId: number;
  questionText: string;
  questionType: QuestionType;
  options?: string[]; // For multiple choice and single choice questions
  correctAnswer: string | boolean;
  points: number;
  difficulty: 'easy' | 'medium' | 'hard';
  orderIndex: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateQuestionRequest {
  examId: number;
  questionText: string;
  questionType: QuestionType;
  options?: string[];
  correctAnswer: string | boolean;
  points: number;
  difficulty: 'easy' | 'medium' | 'hard';
  orderIndex: number;
}

// Student answer interfaces
export interface StudentAnswer {
  questionId: number;
  answer: string | boolean;
  isCorrect?: boolean;
  pointsEarned?: number;
}

// ==========================================
// QUESTION MAPPERS
// ==========================================

export class QuestionMapper {
  /**
   * Convierte una pregunta de la API (snake_case) a formato de dominio (camelCase)
   */
  static fromApi(apiQuestion: QuestionApiResponse): Question {
    return {
      id: apiQuestion.id,
      examId: apiQuestion.exam_id,
      questionText: apiQuestion.question_text,
      questionType: apiQuestion.question_type,
      options: apiQuestion.options,
      correctAnswer: apiQuestion.correct_answer,
      points: apiQuestion.points,
      difficulty: apiQuestion.difficulty,
      orderIndex: apiQuestion.order_index,
      createdAt: new Date(apiQuestion.created_at),
      updatedAt: new Date(apiQuestion.updated_at)
    };
  }

  /**
   * Convierte una solicitud de creación de pregunta del dominio a formato API
   */
  static createRequestToApi(request: CreateQuestionRequest): CreateQuestionApiRequest {
    return {
      exam_id: request.examId,
      question_text: request.questionText,
      question_type: request.questionType,
      options: request.options,
      correct_answer: request.correctAnswer,
      points: request.points,
      difficulty: request.difficulty,
      order_index: request.orderIndex
    };
  }
}

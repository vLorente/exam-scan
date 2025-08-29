import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '@environments/environment';
import {
  Exam,
  ExamApiResponse,
  ExamMapper,
  CreateExamRequest,
  Question,
  QuestionApiResponse,
  QuestionMapper
} from '@core/models';

interface ExamStats {
  totalExams: number;
  totalQuestions: number;
  completedExams: number;
  averageScore: number;
}

@Injectable({
  providedIn: 'root'
})
export class ExamsService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/exams`;

  // Mock data for MVP - will be replaced with real API calls
  private mockExams = signal<Exam[]>([
    {
      id: 1,
      title: 'Matemáticas Básicas',
      description: 'Examen de conceptos fundamentales de matemáticas',
      createdBy: 1,
      isActive: true,
      timeLimit: 60,
      totalQuestions: 15,
      passingScore: 70,
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-01-15')
    },
    {
      id: 2,
      title: 'Historia Universal',
      description: 'Repaso de eventos históricos importantes',
      createdBy: 1,
      isActive: true,
      timeLimit: 45,
      totalQuestions: 20,
      passingScore: 75,
      createdAt: new Date('2024-01-20'),
      updatedAt: new Date('2024-01-20')
    },
    {
      id: 3,
      title: 'Ciencias Naturales',
      description: 'Conceptos básicos de biología, química y física',
      createdBy: 1,
      isActive: true,
      timeLimit: 90,
      totalQuestions: 25,
      passingScore: 80,
      createdAt: new Date('2024-02-01'),
      updatedAt: new Date('2024-02-01')
    }
  ]);

  private mockQuestions = signal<Question[]>([
    // Math exam questions
    {
      id: 1,
      examId: 1,
      questionText: '¿Cuál es el resultado de 2 + 2?',
      questionType: 'multiple_choice',
      options: ['3', '4', '5', '6'],
      correctAnswer: '4',
      points: 5,
      orderIndex: 1,
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-01-15')
    },
    {
      id: 2,
      examId: 1,
      questionText: '¿Es verdadero que π (pi) es aproximadamente 3.14?',
      questionType: 'true_false',
      correctAnswer: true,
      points: 3,
      orderIndex: 2,
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-01-15')
    }
    // More questions would be added here...
  ]);

  /**
   * Get all exams for the current student
   */
  getExams(): Observable<Exam[]> {
    // TODO: Replace with real API call
    // return this.http.get<ExamApiResponse[]>(this.apiUrl)
    //   .pipe(map(exams => exams.map(ExamMapper.fromApi)));

    // Mock implementation
    return new Observable(observer => {
      observer.next(this.mockExams());
      observer.complete();
    });
  }

  /**
   * Get a specific exam by ID
   */
  getExamById(id: number): Observable<Exam | null> {
    // TODO: Replace with real API call
    // return this.http.get<ExamApiResponse>(`${this.apiUrl}/${id}`)
    //   .pipe(map(ExamMapper.fromApi));

    // Mock implementation
    return new Observable(observer => {
      const exam = this.mockExams().find(e => e.id === id) || null;
      observer.next(exam);
      observer.complete();
    });
  }

  /**
   * Get questions for a specific exam
   */
  getExamQuestions(examId: number): Observable<Question[]> {
    // TODO: Replace with real API call
    // return this.http.get<QuestionApiResponse[]>(`${this.apiUrl}/${examId}/questions`)
    //   .pipe(map(questions => questions.map(QuestionMapper.fromApi)));

    // Mock implementation
    return new Observable(observer => {
      const questions = this.mockQuestions().filter(q => q.examId === examId);
      observer.next(questions);
      observer.complete();
    });
  }

  /**
   * Get exam statistics for the current student
   */
  getExamStats(): Observable<ExamStats> {
    // TODO: Replace with real API call

    // Mock implementation
    return new Observable(observer => {
      const exams = this.mockExams();
      const totalQuestions = this.mockQuestions().length;

      const stats: ExamStats = {
        totalExams: exams.length,
        totalQuestions: totalQuestions,
        completedExams: 2, // Mock completed exams
        averageScore: 85 // Mock average score
      };

      observer.next(stats);
      observer.complete();
    });
  }

  /**
   * Get total number of questions across all exams
   */
  getTotalQuestionsCount(): Observable<number> {
    return new Observable(observer => {
      const totalQuestions = this.mockQuestions().length;
      observer.next(totalQuestions);
      observer.complete();
    });
  }

  /**
   * Create a new exam
   */
  createExam(examData: CreateExamRequest): Observable<Exam> {
    // TODO: Replace with real API call
    // return this.http.post<ExamApiResponse>(this.apiUrl, ExamMapper.createRequestToApi(examData))
    //   .pipe(map(ExamMapper.fromApi));

    // Mock implementation
    return new Observable(observer => {
      const newExam: Exam = {
        id: this.mockExams().length + 1,
        title: examData.title,
        description: examData.description,
        createdBy: 1, // Mock current user ID
        isActive: true,
        timeLimit: examData.timeLimit,
        totalQuestions: 0, // Will be updated when questions are added
        passingScore: examData.passingScore,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      // Add to mock data
      this.mockExams.update(exams => [...exams, newExam]);

      observer.next(newExam);
      observer.complete();
    });
  }

  /**
   * Update an existing exam
   */
  updateExam(id: number, examData: Partial<CreateExamRequest>): Observable<Exam> {
    // TODO: Replace with real API call
    // return this.http.put<ExamApiResponse>(`${this.apiUrl}/${id}`, examData)
    //   .pipe(map(ExamMapper.fromApi));

    // Mock implementation
    return new Observable(observer => {
      this.mockExams.update(exams =>
        exams.map(exam =>
          exam.id === id
            ? { ...exam, ...examData, updatedAt: new Date() }
            : exam
        )
      );

      const updatedExam = this.mockExams().find(exam => exam.id === id);
      if (updatedExam) {
        observer.next(updatedExam);
      } else {
        observer.error(new Error('Exam not found'));
      }
      observer.complete();
    });
  }

  /**
   * Delete an exam
   */
  deleteExam(id: number): Observable<boolean> {
    // TODO: Replace with real API call
    // return this.http.delete(`${this.apiUrl}/${id}`).pipe(map(() => true));

    // Mock implementation
    return new Observable(observer => {
      this.mockExams.update(exams => exams.filter(exam => exam.id !== id));
      observer.next(true);
      observer.complete();
    });
  }
}

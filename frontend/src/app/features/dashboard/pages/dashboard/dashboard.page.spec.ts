import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChangeDetectionStrategy, signal } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';

import { DashboardPageComponent } from './dashboard.page';
import { AuthService } from '@core/services/auth';
import { ExamsService } from '@features/exams/services/exams.service';
import { User } from '@core/models';

describe('DashboardPageComponent', () => {
  let component: DashboardPageComponent;
  let fixture: ComponentFixture<DashboardPageComponent>;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockExamsService: jasmine.SpyObj<ExamsService>;

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

  beforeEach(async () => {
    mockAuthService = jasmine.createSpyObj('AuthService', ['logout'], {
      user: signal<User | null>(mockUser)
    });

    mockExamsService = jasmine.createSpyObj('ExamsService', [
      'getExamStats',
      'getExams',
      'getExamById'
    ]);

    // Default return value for getExamStats
    mockExamsService.getExamStats.and.returnValue(of({
      totalExams: 0,
      totalQuestions: 0,
      completedExams: 0,
      averageScore: 0
    }));

    await TestBed.configureTestingModule({
      imports: [DashboardPageComponent],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: ExamsService, useValue: mockExamsService },
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([])
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
    TestBed.resetTestingModule();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize and load exam stats on ngOnInit', () => {
    const mockStats = {
      totalExams: 10,
      totalQuestions: 50,
      completedExams: 5,
      averageScore: 85
    };
    mockExamsService.getExamStats.and.returnValue(of(mockStats));

    component.ngOnInit();

    expect(mockExamsService.getExamStats).toHaveBeenCalled();
  });

  it('should display loading text when exam stats are null', () => {
    // Force examStats to be null
    component['examStats'].set(null);

    const cards = component['allCards']();
    const examsCard = cards.find(card => card.id === 'exams');

    expect(examsCard?.stats).toBe('Cargando estadísticas...');
  });

  it('should update exam stats in cards when stats are loaded', (done) => {
    const mockStats = {
      totalExams: 10,
      totalQuestions: 50,
      completedExams: 5,
      averageScore: 85
    };
    mockExamsService.getExamStats.and.returnValue(of(mockStats));

    component.ngOnInit();

    // Wait for async operation
    setTimeout(() => {
      const cards = component['allCards']();
      const examsCard = cards.find(card => card.id === 'exams');

      expect(examsCard?.stats).toBe('10 exámenes • 50 preguntas');
      done();
    }, 100);
  });

  it('should return all dashboard cards', () => {
    const cards = component.dashboardCards();

    expect(cards.length).toBe(4);
    expect(cards[0].id).toBe('exams');
    expect(cards[1].id).toBe('practice');
    expect(cards[2].id).toBe('results');
    expect(cards[3].id).toBe('study-materials');
  });

  it('should have correct properties for exams card', () => {
    const cards = component.dashboardCards();
    const examsCard = cards.find(card => card.id === 'exams');

    expect(examsCard?.title).toBe('Mis Exámenes');
    expect(examsCard?.buttonText).toBe('Ver Exámenes');
    expect(examsCard?.icon).toBe('quiz');
    expect(examsCard?.routerLink).toBe('/exams');
    expect(examsCard?.disabled).toBeFalsy();
  });

  it('should have disabled cards for upcoming features', () => {
    const cards = component.dashboardCards();
    const practiceCard = cards.find(card => card.id === 'practice');
    const resultsCard = cards.find(card => card.id === 'results');
    const studyCard = cards.find(card => card.id === 'study-materials');

    expect(practiceCard?.disabled).toBe(true);
    expect(resultsCard?.disabled).toBe(true);
    expect(studyCard?.disabled).toBe(true);
  });

  it('should return dashboard stats for authenticated user', () => {
    const stats = component.dashboardStats();

    expect(stats.length).toBe(4);
    expect(stats[0].value).toBe('5');
    expect(stats[0].label).toBe('Exámenes Completados');
    expect(stats[1].value).toBe('85%');
    expect(stats[1].label).toBe('Promedio General');
    expect(stats[2].value).toBe('3');
    expect(stats[2].label).toBe('Exámenes Pendientes');
    expect(stats[3].value).toBe('24');
    expect(stats[3].label).toBe('Días de Racha');
  });

  it('should return empty stats array when user is not authenticated', () => {
    // Create new mock with null user
    const noUserAuthService = jasmine.createSpyObj('AuthService', ['logout'], {
      user: signal<User | null>(null)
    });

    TestBed.resetTestingModule();

    TestBed.configureTestingModule({
      imports: [DashboardPageComponent],
      providers: [
        { provide: AuthService, useValue: noUserAuthService },
        { provide: ExamsService, useValue: mockExamsService },
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([])
      ]
    });

    const noUserFixture = TestBed.createComponent(DashboardPageComponent);
    const noUserComponent = noUserFixture.componentInstance;
    noUserFixture.detectChanges();

    const stats = noUserComponent.dashboardStats();

    expect(stats.length).toBe(0);

    noUserFixture.destroy();
  });

  it('should include aria labels for all stats', () => {
    const stats = component.dashboardStats();

    stats.forEach(stat => {
      expect(stat.ariaLabel).toBeDefined();
      expect(stat.ariaLabel.length).toBeGreaterThan(0);
    });
  });

  it('should handle card action and log card id', () => {
    spyOn(console, 'log');

    component.handleCardAction('exams');

    expect(console.log).toHaveBeenCalledWith('Card action triggered: exams');
  });

  it('should inject AuthService and ExamsService', () => {
    expect(component['authService']).toBeDefined();
    expect(component['examsService']).toBeDefined();
  });

  describe('Initial state tests', () => {
    let initialFixture: ComponentFixture<DashboardPageComponent>;
    let initialComponent: DashboardPageComponent;

    beforeEach(async () => {
      TestBed.resetTestingModule();

      await TestBed.configureTestingModule({
        imports: [DashboardPageComponent],
        providers: [
          { provide: AuthService, useValue: mockAuthService },
          { provide: ExamsService, useValue: mockExamsService },
          provideHttpClient(),
          provideHttpClientTesting(),
          provideRouter([])
        ]
      }).compileComponents();

      initialFixture = TestBed.createComponent(DashboardPageComponent);
      initialComponent = initialFixture.componentInstance;
      // Don't call detectChanges - keep initial state
    });

    afterEach(() => {
      initialFixture.destroy();
      TestBed.resetTestingModule();
    });

    it('should have examStats signal initialized to null', () => {
      const initialStats = initialComponent['examStats']();
      expect(initialStats).toBeNull();
    });

    it('should have authService injected', () => {
      expect(initialComponent['authService']).toBeDefined();
    });

    it('should have examsService injected', () => {
      expect(initialComponent['examsService']).toBeDefined();
    });

    it('should have dashboardCards computed signal defined', () => {
      const cards = initialComponent.dashboardCards();
      expect(cards).toBeDefined();
      expect(Array.isArray(cards)).toBe(true);
    });

    it('should have dashboardStats computed signal defined', () => {
      const stats = initialComponent.dashboardStats();
      expect(stats).toBeDefined();
      expect(Array.isArray(stats)).toBe(true);
    });
  });
});

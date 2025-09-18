import { Routes } from '@angular/router';
import { authGuard, guestGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/landing/pages/landing-page/landing-page').then(m => m.LandingPageComponent),
    canActivate: [guestGuard]
  },
  {
    path: 'login',
    loadComponent: () => import('./features/auth/pages/login/login.page').then(m => m.LoginPageComponent),
    canActivate: [guestGuard]
  },
  {
    path: 'register',
    loadComponent: () => import('./features/auth/pages/register/register.page').then(m => m.RegisterPageComponent),
    canActivate: [guestGuard]
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./features/dashboard/pages/dashboard/dashboard.page').then(m => m.DashboardPageComponent),
    canActivate: [authGuard]
  },
  {
    path: 'exams',
    loadComponent: () => import('./features/exams/pages/exams/exams.page').then(m => m.ExamsListPageComponent),
    canActivate: [authGuard]
  },
  {
    path: 'exams/create',
    loadComponent: () => import('./features/exams/pages/create-exam/create-exam.page').then(m => m.CreateExamPageComponent),
    canActivate: [authGuard]
  },
  {
    path: 'exams/:id/questions',
    loadComponent: () => import('./features/exams/pages/create-questions/create-questions.page').then(m => m.CreateQuestionsPageComponent),
    canActivate: [authGuard]
  },
  {
    path: '**',
    redirectTo: '/'
  }
];

import { Component, input, output, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { User } from '@core/models/user.model';

@Component({
  selector: 'app-header',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class HeaderComponent {
  user = input.required<User | null>();
  title = input<string>('ExamScan');
  subtitle = input<string>('Dashboard');
  logout = output<void>();

  getRoleLabel(role: string): string {
    const labels = {
      'admin': 'Administrador',
      'teacher': 'Profesor',
      'student': 'Estudiante'
    };
    return labels[role as keyof typeof labels] || role;
  }

  onLogout(): void {
    this.logout.emit();
  }
}

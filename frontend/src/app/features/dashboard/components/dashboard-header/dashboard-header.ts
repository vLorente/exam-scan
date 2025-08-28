import { Component, input, output, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { User } from '../../../../core/models/user.model';

@Component({
  selector: 'app-dashboard-header',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
  templateUrl: './dashboard-header.html',
  styleUrl: './dashboard-header.css'
})
export class DashboardHeaderComponent {
  user = input.required<User | null>();
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

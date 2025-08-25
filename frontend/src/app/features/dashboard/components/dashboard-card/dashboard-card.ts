import { Component, input, output, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-dashboard-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard-card.html',
  styleUrl: './dashboard-card.css'
})
export class DashboardCardComponent {
  title = input.required<string>();
  description = input.required<string>();
  buttonText = input.required<string>();
  routerLink = input<string>();
  disabled = input<boolean>(false);
  buttonClass = input<string>('btn-primary');
  buttonClick = output<void>();

  onButtonClick(): void {
    if (!this.disabled()) {
      this.buttonClick.emit();
    }
  }
}

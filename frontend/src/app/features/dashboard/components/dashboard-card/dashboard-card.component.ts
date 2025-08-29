import { Component, input, output, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { DashboardCardIconComponent } from '../dashboard-card-icon/dashboard-card-icon.component';

@Component({
  selector: 'app-dashboard-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, RouterLink, DashboardCardIconComponent],
  templateUrl: './dashboard-card.component.html',
  styleUrl: './dashboard-card.component.css'
})
export class DashboardCardComponent {
  title = input.required<string>();
  description = input.required<string>();
  buttonText = input.required<string>();
  icon = input<string>('info');
  routerLink = input<string>();
  disabled = input<boolean>(false);
  buttonClass = input<string>('btn-primary');
  stats = input<string>(); // New input for displaying stats
  buttonClick = output<void>();

  // Helper function to generate IDs
  titleId = computed(() => 'card-title-' + this.createId(this.title()));
  descId = computed(() => 'card-desc-' + this.createId(this.title()));
  btnDescId = computed(() => 'btn-desc-' + this.createId(this.title()));

  private createId(text: string): string {
    return text.toLowerCase().replace(/\s+/g, '-');
  }

  onButtonClick(): void {
    if (!this.disabled()) {
      this.buttonClick.emit();
    }
  }
}

import { Component, input, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard-card-icon',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
  templateUrl: './dashboard-card-icon.component.html',
  styleUrl: './dashboard-card-icon.component.css'
})
export class DashboardCardIconComponent {
  icon = input.required<string>();

  // Computed para generar ID único para aria-labelledby si fuera necesario
  iconId = computed(() => `icon-${this.icon()}-${Math.random().toString(36).substr(2, 9)}`);

  // Computed para obtener clases CSS basadas en el icono
  iconClasses = computed(() => `card-icon icon-${this.icon()}`);
}

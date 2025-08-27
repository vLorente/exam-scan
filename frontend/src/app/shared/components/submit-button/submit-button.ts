import { Component, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-submit-button',
  imports: [MatButtonModule, MatIconModule, MatProgressSpinnerModule],
  styleUrl: './submit-button.css',
  templateUrl: './submit-button.html',
})
export class SubmitButtonComponent {
  // Required inputs
  text = input.required<string>();

  // Optional inputs
  disabled = input<boolean>(false);
  loading = input<boolean>(false);
  icon = input<string>('');
  loadingText = input<string>('Procesando...');

  // Accessibility inputs
  description = input<string>('');
  descriptionId = input<string>('');
  loadingDescription = input<string>('');
  loadingDescriptionId = input<string>('');

  // Output
  onClick = output<void>();
}

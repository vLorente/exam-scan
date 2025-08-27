import { Component, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-submit-button',
  imports: [MatButtonModule, MatIconModule, MatProgressSpinnerModule],
  styleUrl: './submit-button.css',
  template: `
    <button
      mat-raised-button
      type="submit"
      class="submit-button"
      [disabled]="disabled() || loading()"
      [attr.aria-describedby]="loading() ? loadingDescriptionId() : descriptionId()"
      (click)="onClick.emit()"
    >
      @if (loading()) {
        <mat-progress-spinner
          diameter="20"
          class="inline-spinner"
          mode="indeterminate"
          aria-hidden="true">
        </mat-progress-spinner>
        <span>{{ loadingText() }}</span>
        @if (loadingDescriptionId()) {
          <span [id]="loadingDescriptionId()" class="sr-only">
            {{ loadingDescription() }}
          </span>
        }
      } @else {
        @if (icon()) {
          <mat-icon aria-hidden="true">{{ icon() }}</mat-icon>
        }
        <span>{{ text() }}</span>
        @if (descriptionId()) {
          <span [id]="descriptionId()" class="sr-only">
            {{ description() }}
          </span>
        }
      }
    </button>
  `,
  styles: []
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

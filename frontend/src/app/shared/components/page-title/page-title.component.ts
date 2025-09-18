import { Component, input, output, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-page-title',
  templateUrl: './page-title.component.html',
  styleUrls: ['./page-title.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule]
})
export class PageTitleComponent {
  // Inputs
  title = input.required<string>();
  description = input<string>('');
  showBackButton = input<boolean>(true);
  backButtonText = input<string>('Volver');
  backButtonAriaLabel = input<string>('Volver');

  // Outputs
  backClick = output<void>();

  // Computed properties
  titleId = computed(() => {
    const titleValue = this.title();
    return titleValue ? 'page-title-' + titleValue.replace(/\s+/g, '-').toLowerCase() : null;
  });

  ariaLabelledBy = computed(() => {
    return this.titleId();
  });

  // Methods
  onBackClick() {
    this.backClick.emit();
  }
}

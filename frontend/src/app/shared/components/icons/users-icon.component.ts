import { Component, ChangeDetectionStrategy, input } from '@angular/core';

@Component({
  selector: 'app-users-icon',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <svg
      [attr.width]="size()"
      [attr.height]="size()"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      [attr.aria-hidden]="ariaHidden()">
      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
      <circle cx="12" cy="7" r="4"/>
    </svg>
  `,
  styles: [`
    :host {
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }

    svg {
      transition: all var(--transition-normal, 0.2s ease);
    }
  `]
})
export class UsersIconComponent {
  size = input<string>('18');
  ariaHidden = input<boolean>(true);
}

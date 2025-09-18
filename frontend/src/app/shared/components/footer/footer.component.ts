import { Component, input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent {
  appName = input<string>('ExamScan');
  version = input<string>('v1.0.0');
  companyName = input<string>('Tu Institución');
  showLinks = input<boolean>(true);

  currentYear = new Date().getFullYear();
}

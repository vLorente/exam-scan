import { Component, input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../header/header';
import { FooterComponent } from '../footer/footer';

@Component({
  selector: 'app-layout',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, HeaderComponent, FooterComponent],
  templateUrl: './layout.html',
  styleUrl: './layout.css'
})
export class LayoutComponent {
  // Header inputs (user ya no es necesario)
  title = input<string>('ExamScan');
  subtitle = input<string>('Dashboard');

  // Footer inputs
  appName = input<string>('ExamScan');
  version = input<string>('v1.0.0');
  companyName = input<string>('Tu Institución');
  showFooterLinks = input<boolean>(true);
}

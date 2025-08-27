import { Component, ChangeDetectionStrategy } from '@angular/core';
import { HeroSectionComponent } from '../../components/hero-section/hero-section';
import { FeaturesSectionComponent } from '../../components/features-section/features-section';
import { DemoSectionComponent } from '../../components/demo-section/demo-section';
import { CtaSectionComponent } from '../../components/cta-section/cta-section';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.html',
  styleUrls: ['./landing-page.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    HeroSectionComponent,
    FeaturesSectionComponent,
    DemoSectionComponent,
    CtaSectionComponent
  ]
})
export class LandingPageComponent {}

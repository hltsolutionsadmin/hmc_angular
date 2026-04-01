import { Component, Input } from '@angular/core';
import { StoreBanner } from '../../../../shared/models/storefront';

@Component({
  selector: 'app-home-hero-section',
  templateUrl: './hero-section.component.html',
  styleUrl: './hero-section.component.css'
})
export class HeroSectionComponent {
  @Input() banners: StoreBanner[] = [];
}


import { Component, Input } from '@angular/core';

export interface HomeTestimonial {
  name: string;
  text: string;
}

@Component({
  selector: 'app-home-testimonials-section',
  templateUrl: './testimonials-section.component.html',
  styleUrl: './testimonials-section.component.css'
})
export class TestimonialsSectionComponent {
  @Input() testimonials: HomeTestimonial[] = [];
}


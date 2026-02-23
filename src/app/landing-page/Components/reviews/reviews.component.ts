import { Component } from '@angular/core';

@Component({
  selector: 'app-reviews',
  templateUrl: './reviews.component.html',
  styleUrl: './reviews.component.css'
})
export class ReviewsComponent {
   quotes = [
    {
      quotes: '../../../../assets/quote.svg',
      img: '../../../../assets/avatar-02.svg',
      name: 'Raju',
      Place: 'Dr. A. Sharma',
      desc: 'I’ve been coming here for years, and I always feel heard. The doctors take their time and actually explained.',
    },
    {
      quotes: '../../../../assets/quote.svg',
      img: '../../../../assets/avatar-03.svg',
      name: 'Anita',
      Place: 'Dr. Mehta',
      desc: 'Great service and quick response. Loved the chatbot’s instant answers.',
    },
    {
      quotes: '../../../../assets/quote.svg',
      img: '../../../../assets/avatar-02.svg',
      name: 'Rahul',
      Place: 'Dr. Kapoor',
      desc: 'Very intuitive and responsive AI assistant. Made my clinic visits simpler!',
    },
  ];
}

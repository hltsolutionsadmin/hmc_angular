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
      Place: 'Anakapalle',
      desc: 'Quick service and clear reports. Staff explained the process well and results were on time.',
    },
    {
      quotes: '../../../../assets/quote.svg',
      img: '../../../../assets/avatar-03.svg',
      name: 'Anita',
      Place: 'Anakapalle',
      desc: 'Very clean centre and fast testing. The report quality is good and easy to understand.',
    },
    {
      quotes: '../../../../assets/quote.svg',
      img: '../../../../assets/avatar-02.svg',
      name: 'Rahul',
      Place: 'Anakapalle',
      desc: 'I came for PFT and the procedure was smooth. Got my report quickly with proper guidance.',
    },
  ];
}

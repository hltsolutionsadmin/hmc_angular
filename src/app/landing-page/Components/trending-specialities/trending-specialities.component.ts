import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-trending-specialities',
  templateUrl: './trending-specialities.component.html',
  styleUrl: './trending-specialities.component.css'
})
export class TrendingSpecialitiesComponent implements AfterViewInit {
@ViewChild('carousel') carousel!: ElementRef;
@ViewChild('trendingSection') section!: ElementRef;
isVisible = false;

  specialities = [
    {
      name: 'Cardiology',
      doctors: 20,
      icon: '../../../../assets/icon-01.svg',
    },
    {
      name: 'Dental Care',
      doctors: 15,
      icon: '../../../../assets/icon-02.svg',
    },
    {
      name: 'Neurology',
      doctors: 12,
      icon: '../../../../assets/icon-03.svg',
    },
    {
      name: 'Gynecology',
      doctors: 10,
      icon: '../../../../assets/icon-04.svg',
    },
    {
      name: 'Oncology',
      doctors: 17,
      icon: '../../../../assets/icon-05.svg',
    },
    {
      name: 'Urology',
      doctors: 14,
      icon: '../../../../assets/icon-06.svg',
    },
  ];

  ngAfterViewInit() {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            this.isVisible = true;
            observer.unobserve(this.section.nativeElement); // only trigger once
          }
        });
      },
      { threshold: 0.3 } // 30% of section must be visible
    );

    observer.observe(this.section.nativeElement);
  }

  scrollLeft() {
    this.carousel.nativeElement.scrollBy({ left: -300, behavior: 'smooth' });
  }

  scrollRight() {
    this.carousel.nativeElement.scrollBy({ left: 300, behavior: 'smooth' });
  }
}

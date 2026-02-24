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
    { name: 'TMT', icon: '../../../../assets/tmt.png' },
    { name: 'PFT', icon: '../../../../assets/pft.png' },
    { name: 'X-Ray', icon: '../../../../assets/xray.png' },
    { name: 'Audiometry', icon: '../../../../assets/audiometry.png' },
    { name: 'ECG', icon: '../../../../assets/ecg.png' },
    { name: '2D Echo', icon: '../../../../assets/2d echo.png' },
  ];

  ngAfterViewInit() {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            this.isVisible = true;
            observer.unobserve(this.section.nativeElement);
          }
        });
      },
      { threshold: 0.3 }
    );

    observer.observe(this.section.nativeElement);
  }

  scrollLeft() {
    const cardWidth =
      this.carousel.nativeElement.firstElementChild.offsetWidth + 24;
    this.carousel.nativeElement.scrollBy({
      left: -cardWidth,
      behavior: 'smooth',
    });
  }

  scrollRight() {
    const cardWidth =
      this.carousel.nativeElement.firstElementChild.offsetWidth + 24;
    this.carousel.nativeElement.scrollBy({
      left: cardWidth,
      behavior: 'smooth',
    });
  }
}

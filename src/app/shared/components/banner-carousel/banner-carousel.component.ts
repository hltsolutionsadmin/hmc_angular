import { animate, style, transition, trigger } from '@angular/animations';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { interval, Subject, takeUntil } from 'rxjs';
import { StoreBanner } from '../../models/storefront';

@Component({
  selector: 'app-banner-carousel',
  templateUrl: './banner-carousel.component.html',
  styleUrl: './banner-carousel.component.css',
  animations: [
    trigger('slideFade', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(10px) scale(0.98)' }),
        animate('420ms ease-out', style({ opacity: 1, transform: 'translateY(0) scale(1)' }))
      ]),
      transition(':leave', [
        animate('220ms ease-in', style({ opacity: 0, transform: 'translateY(-6px) scale(0.99)' }))
      ])
    ])
  ]
})
export class BannerCarouselComponent implements OnInit, OnDestroy {
  @Input() banners: StoreBanner[] = [];
  @Input() autoMs = 500000;

  active = 0;
  private readonly destroy$ = new Subject<void>();

  ngOnInit(): void {
    interval(this.autoMs)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        if (this.banners.length <= 1) return;
        this.active = (this.active + 1) % this.banners.length;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  setActive(i: number): void {
    this.active = i;
  }

  themeClass(theme: StoreBanner['theme']): string {
    switch (theme) {
      case 'mint':
        return 'from-emerald-500 via-teal-500 to-sky-600';
      case 'blue':
        return 'from-blue-600 via-indigo-600 to-sky-600';
      case 'violet':
        return 'from-violet-600 via-fuchsia-600 to-indigo-600';
      case 'sunset':
        return 'from-amber-500 via-orange-500 to-rose-600';
      default:
        return 'from-indigo-600 via-blue-600 to-sky-600';
    }
  }
}


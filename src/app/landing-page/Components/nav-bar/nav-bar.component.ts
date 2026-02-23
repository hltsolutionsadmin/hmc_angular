import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.css'
})
export class NavBarComponent {
   hideTopBar = false;
  private lastScrollTop = 0;

  scrollToSection(sectionId: string) {
    const el = document.getElementById(sectionId);
    if (!el) return;

    const headerOffset = 90;
    const elementPosition = el.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.scrollY - headerOffset;

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const st = window.pageYOffset || document.documentElement.scrollTop;
    if (st > this.lastScrollTop && st > 100) {
      this.hideTopBar = true;
    } else {
      this.hideTopBar = false;
    }
    this.lastScrollTop = st <= 0 ? 0 : st;
  }
}

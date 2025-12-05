import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.css'
})
export class NavBarComponent {
hideTopBar = false;
  private lastScrollTop = 0;

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const st = window.pageYOffset || document.documentElement.scrollTop;
    if (st > this.lastScrollTop && st > 100) {
      // Scrolling down → hide top bar
      this.hideTopBar = true;
    } else {
      // Scrolling up → show top bar
      this.hideTopBar = false;
    }
    this.lastScrollTop = st <= 0 ? 0 : st;
  }
}

import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  hide = true;
  hide2 = true;
  model: any = { clinic: '', email: '', password: '', confirm: '', address: '', phone: '' };

  constructor(private router: Router) {}

  onRegister() {
    // Mock register success
    if (this.model.clinic && this.model.email && this.model.password === this.model.confirm) {
      this.router.navigate(['/login']);
    }
  }
}

import { Component } from '@angular/core';

@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrl: './profile-page.component.css'
})
export class ProfilePageComponent {
  name = 'Clinic User';
  mobile = '9999999999';
  email = 'user@clinic.com';

}


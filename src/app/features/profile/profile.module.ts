import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { SharedModule } from '../../shared/shared.module';
import { ProfileRoutingModule } from './profile-routing.module';
import { ProfilePageComponent } from './profile-page/profile-page.component';

@NgModule({
  declarations: [ProfilePageComponent],
  imports: [CommonModule, FormsModule, SharedModule, MatIconModule, ProfileRoutingModule]
})
export class ProfileModule {}


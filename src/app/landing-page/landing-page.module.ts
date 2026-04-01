import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './Components/home/home.component';
import { NavBarComponent } from './Components/nav-bar/nav-bar.component';
import { MatIconModule } from '@angular/material/icon';
import { HeroComponent } from './Components/hero/hero.component';
import { TrendingSpecialitiesComponent } from './Components/trending-specialities/trending-specialities.component';
import { HealthcareSectionComponent } from './Components/healthcare-section/healthcare-section.component';
import { ReviewsComponent } from './Components/reviews/reviews.component';
import { ReachUsComponent } from './Components/reach-us/reach-us.component';
import { FooterComponent } from './Components/footer/footer.component';
import { LandingPageRoutingModule } from './landing-page-routing.module';
import { SharedModule } from "../shared/shared.module";



@NgModule({
  declarations: [
    HomeComponent,
    NavBarComponent,
    HeroComponent,
    TrendingSpecialitiesComponent,
    HealthcareSectionComponent,
    ReviewsComponent,
    ReachUsComponent,
    FooterComponent
  ],
  imports: [
    CommonModule,
    MatIconModule,
    LandingPageRoutingModule,
    SharedModule
]
})
export class LandingPageModule { }

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { LayoutModule } from './core/layout/layout.module';
import { AuthModule } from './auth/auth.module';
import { LandingPageModule } from './landing-page/landing-page.module';
import { OrdersModule } from './features/orders/orders.module';
import { ReportsModule } from './features/reports/reports.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    LayoutModule,
    AuthModule,
    FormsModule,
    LandingPageModule,
    OrdersModule,
    FontAwesomeModule,
    ReportsModule
  ],
  providers: [
    provideAnimationsAsync()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

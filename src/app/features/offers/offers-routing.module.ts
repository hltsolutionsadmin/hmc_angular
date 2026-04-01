import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OffersPageComponent } from './offers-page/offers-page.component';

const routes: Routes = [{ path: '', component: OffersPageComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OffersRoutingModule {}


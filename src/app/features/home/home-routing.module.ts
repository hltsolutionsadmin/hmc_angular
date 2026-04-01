import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StoreHomeComponent } from './store-home/store-home.component';

const routes: Routes = [
  { path: '', component: StoreHomeComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule {}


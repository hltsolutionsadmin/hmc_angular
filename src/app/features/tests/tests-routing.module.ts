import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TestsListComponent } from './tests-list/tests-list.component';

const routes: Routes = [
  { path: '', component: TestsListComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TestsRoutingModule { }

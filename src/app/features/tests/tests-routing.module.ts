import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TestsListComponent } from './tests-list/tests-list.component';
import { TestDetailsComponent } from './test-details/test-details.component';

const routes: Routes = [
  { path: '', component: TestsListComponent },
  { path: 'test/:id', component: TestDetailsComponent },
  { path: '**', redirectTo: '' } // Redirect any unknown paths to the tests list
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TestsRoutingModule { }

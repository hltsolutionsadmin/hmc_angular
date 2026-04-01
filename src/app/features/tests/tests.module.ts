import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { TestsRoutingModule } from './tests-routing.module';
import { TestsListComponent } from './tests-list/tests-list.component';
import { CategoriesComponent } from './categories/categories.component';
import { TestDetailsComponent } from './test-details/test-details.component';

import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { SharedModule } from '../../shared/shared.module';

@NgModule({
  declarations: [
    TestsListComponent,
    CategoriesComponent,
    TestDetailsComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    TestsRoutingModule,
    SharedModule,
    MatIconModule,
    MatButtonModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
  ],
})
export class TestsModule { }

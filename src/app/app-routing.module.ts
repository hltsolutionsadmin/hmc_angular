import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegisterComponent } from './auth/register/register.component';
import { HomeComponent } from './landing-page/Components/home/home.component';
import { LoginComponent } from './auth/login/login.component';
import { SideNavComponent } from './core/layout/side-nav/side-nav.component';

const routes: Routes = [
  { path: '', redirectTo: 'landing-page', pathMatch: 'full' },
  { path: 'landing-page', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  {
    path: 'layout',
    component: SideNavComponent,
    children: [
      {
        path: '',
        redirectTo: 'layout',
        pathMatch: 'full'
      },
      {
        path: 'tests',
        loadChildren: () => import('./features/tests/tests.module').then(m => m.TestsModule)
      },
      {
        path: 'orders',
        loadChildren: () => import('./features/orders/orders.module').then(m => m.OrdersModule)
      },
      {
        path: 'reports',
        loadChildren: () => import('./features/reports/reports.module').then(m => m.ReportsModule)
      }
    ]
  },
  { path: '**', redirectTo: 'login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

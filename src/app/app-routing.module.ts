import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'landing-page', pathMatch: 'full' },
  {
    path: 'landing-page',
    loadChildren: () =>
      import('./landing-page/landing-page.module').then((m) => m.LandingPageModule)
  },
  {
    path: 'layout',
    loadChildren: () =>
      import('./core/layout/layout.module').then((m) => m.LayoutModule)
  },
  {
    path: '',
    loadChildren: () => import('./auth/auth.module').then((m) => m.AuthModule)
  },
  { path: '**', redirectTo: 'login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

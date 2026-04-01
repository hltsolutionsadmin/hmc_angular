import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SideNavComponent } from './side-nav/side-nav.component';
import { RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { HeaderComponentComponent } from './header-component/header-component.component';
import { LayoutComponentComponent } from './layout-component/layout-component.component';
import { SharedModule } from '../../shared/shared.module';
import { LayoutRoutingModule } from './layout-routing.module';



@NgModule({
  declarations: [
    SideNavComponent,
    HeaderComponentComponent,
    LayoutComponentComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    LayoutRoutingModule,
    SharedModule,
    MatToolbarModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatButtonModule,
    MatTooltipModule
  ],
  exports: []
})
export class LayoutModule { }

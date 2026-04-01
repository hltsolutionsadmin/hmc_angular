import{NgModule}from'@angular/core';
import{CommonModule}from'@angular/common';
import{MatIconModule}from'@angular/material/icon';

import{HomeRoutingModule}from'./home-routing.module';
import{SharedModule}from'../../shared/shared.module';
import{StoreHomeComponent}from'./store-home/store-home.component';
import{SectionsModule}from'./sections/sections.module';

@NgModule({
declarations:[StoreHomeComponent],
imports:[CommonModule,HomeRoutingModule,SharedModule,MatIconModule,SectionsModule]
})
export
class
HomeModule{}

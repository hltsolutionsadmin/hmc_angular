import{NgModule}from'@angular/core';
import{RouterModule,Routes}from'@angular/router';
import{authGuard}from'../../auth/guards/auth.guard';
import{LayoutComponentComponent}from'./layout-component/layout-component.component';

const
routes:Routes=[
{path:'',component:LayoutComponentComponent,canActivate:[authGuard],children:[
{path:'',redirectTo:'tests',pathMatch:'full'},
{path:'',loadChildren:()=>import('../../features/pages/pages.module').then((m)=>m.PagesModule)}
]}
];

@NgModule({
imports:[RouterModule.forChild(routes)],
exports:[RouterModule]
})
export
class
LayoutRoutingModule{}

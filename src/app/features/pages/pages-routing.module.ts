import{NgModule}from'@angular/core';
import{RouterModule,Routes}from'@angular/router';

const
routes:Routes=[
// {path:'home',redirectTo:'tests',pathMatch:'full'},
{path:'tests',loadChildren:()=>import('../tests/tests.module').then((m)=>m.TestsModule)},
{path:'booking',loadChildren:()=>import('../booking/booking.module').then((m)=>m.BookingModule)},
// {path:'cart',loadChildren:()=>import('../cart/cart.module').then((m)=>m.CartModule)},
{path:'checkout',loadChildren:()=>import('../checkout/checkout.module').then((m)=>m.CheckoutModule)},
{path:'orders',loadChildren:()=>import('../orders/orders.module').then((m)=>m.OrdersModule)},
// {path:'reports',loadChildren:()=>import('../reports/reports.module').then((m)=>m.ReportsModule)},
{path:'offers',loadChildren:()=>import('../offers/offers.module').then((m)=>m.OffersModule)},
{path:'profile',loadChildren:()=>import('../profile/profile.module').then((m)=>m.ProfileModule)}
];

@NgModule({
imports:[RouterModule.forChild(routes)],
exports:[RouterModule]
})
export
class
PagesRoutingModule{}

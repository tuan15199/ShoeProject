import { SearchTopComponent } from './pages/search-top/search-top.component';
import { OrderSucessComponent } from './pages/order-sucess/order-sucess.component';
import { OrderDetailComponent } from './pages/order/order-detail.component';
import { OrderComponent } from './pages/order/order.component';
import { MailComponent } from './pages/email/mail/mail.component';
import { OrderInfoComponent } from './pages/user/order-info.component';
import { ProductDetailComponent } from './pages/product/product-detail.component';
import { ProductComponent } from './pages/product/product.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { DefaultLayoutComponent } from './container/default-layout/default-layout.component';
import { UserComponent } from './pages/user/user.component';
import { AuthGuard } from './auth-guard.guard';


const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'login', component: LoginComponent },
  { path: 'user', component: UserComponent },
  { path: 'userInfo', component: OrderInfoComponent },
  { path: 'mail', component: MailComponent },

  { path: '', component: DefaultLayoutComponent, canActivate: [AuthGuard],
    children: [
      { path: 'product', component: ProductComponent},
      { path: 'order', component: OrderComponent},
      { path: 'orderSuccess', component: OrderSucessComponent},
      { path: 'top', component: SearchTopComponent},
      { path: 'productDetail/:id', component: ProductDetailComponent},
      { path: 'orderDetail/:id', component: OrderDetailComponent}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

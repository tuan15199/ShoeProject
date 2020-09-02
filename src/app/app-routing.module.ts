import { ProductComponent } from './pages/product/product.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { DefaultLayoutComponent } from './container/default-layout/default-layout.component';


const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'login', component: LoginComponent },

  { path: 'home', component: DefaultLayoutComponent },
  { path: '', component: DefaultLayoutComponent,
    children: [
      { path: 'product', component: ProductComponent}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

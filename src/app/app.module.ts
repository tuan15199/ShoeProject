import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AuthGuard } from './auth-guard.guard';
import { AuthInterceptor } from './auth.interceptor';
import { LoadingBarHttpClientModule } from '@ngx-loading-bar/http-client';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { ModalModule } from 'ngx-bootstrap/modal';
import { DataTablesModule } from 'angular-datatables';
import { CookieService} from 'ngx-cookie-service';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DefaultLayoutComponent } from './container/default-layout/default-layout.component';
import { LoginComponent } from './pages/login/login.component';
import { ProductComponent } from './pages/product/product.component';
import { HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http';
import { DropdownnDirective } from './shared/dropdownn.directive';
import { ProductDetailComponent } from './pages/product/product-detail.component';
import { UserComponent } from './pages/user/user.component';
import { OrderInfoComponent } from './pages/user/order-info.component';
import { MailComponent } from './pages/email/mail/mail.component';
import { DatePipe } from '@angular/common';
import { OrderComponent } from './pages/order/order.component';
import { OrderDetailComponent } from './pages/order/order-detail.component';
import { OrderSucessComponent } from './pages/order-sucess/order-sucess.component';
import { SearchTopComponent } from './pages/search-top/search-top.component';

@NgModule({
  declarations: [
    AppComponent,
    DefaultLayoutComponent,
    LoginComponent,
    ProductComponent,
    DropdownnDirective,
    ProductDetailComponent,
    UserComponent,
    OrderInfoComponent,
    MailComponent,
    OrderComponent,
    OrderDetailComponent,
    OrderSucessComponent,
    SearchTopComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    AppRoutingModule,
    LoadingBarHttpClientModule,
    ModalModule.forRoot(),
    DataTablesModule,
    ReactiveFormsModule
  ],
  providers: [CookieService, AuthGuard, 
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

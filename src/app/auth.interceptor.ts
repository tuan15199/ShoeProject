import { Router } from '@angular/router';
import { LoginInfo } from './models/loginInfo';
import { CookieService } from 'ngx-cookie-service';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs/operators';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpHeaders
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { nextTick } from 'process';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private cookie: CookieService, private router: Router) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const infoStr = this.cookie.get('info');

    if(infoStr){
      const info = JSON.parse(infoStr) as LoginInfo;
      // const headers = new HttpHeaders({
      //   Authorization: info.accessToken
      // });

      const headers = new HttpHeaders({
        Authorization: info.accessToken,
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': 'true',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE',
        'key': 'x-api-key',
        'value': 'NNctr6Tjrw9794gFXf3fi6zWBZ78j6Gv3UCb3y0x',
      })

      request = request.clone({headers});

    }

    return next.handle(request).pipe(
      tap(event => {

        }, error => {
          if (error.status === 401) {
            this.router.navigate(['/login'])
          }
        }
      )
    )
  }   
}

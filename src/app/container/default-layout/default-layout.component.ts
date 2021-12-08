import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { LoginInfo } from 'src/app/models/loginInfo';
import { LoginService } from 'src/app/service/login.service';

@Component({
  selector: 'app-default-layout',
  templateUrl: './default-layout.component.html',
  styleUrls: ['./default-layout.component.css']
})
export class DefaultLayoutComponent implements OnInit {
  userName: String;

  constructor(private cookieService: CookieService, private loginService: LoginService, private router: Router) { }

  ngOnInit(): void {
    const infoStr = this.cookieService.get('info');
    if(infoStr){
      const info = JSON.parse(infoStr) as LoginInfo;
      this.userName = info.fullName;
    }
  }

  logout(event){
    event.preventDefault();
    this.loginService.setLoggedIn(false);
    this.cookieService.deleteAll();

    this.router.navigate(['']);
  }

}

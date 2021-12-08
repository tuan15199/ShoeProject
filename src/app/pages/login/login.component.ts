import { User } from './../../models/user';
import { LoginService } from './../../service/login.service';
import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  message = '';
  usernames = '';
  passwords= '';
  user: User = {} as User;
  constructor(private router: Router, private loginService: LoginService, private cookie: CookieService){}

  
  ngOnInit(): void {
    
  }

  doLogin(){
    this.user.username = this.usernames
    this.user.password = this.passwords
    
    this.loginService.get(this.user).subscribe(res =>{
        this.loginService.setLoggedIn(true);
        this.cookie.set('info',JSON.stringify(res));
        this.router.navigate(['/product']);
    }, err => {
      if(err.status == 422)
        this.message = "Wrong user name or password!"
      else if(err.status == 401 || err.status == 403) {
        this.cookie.deleteAll()
        this.router.navigate(['']);
      }
    })
  }

}

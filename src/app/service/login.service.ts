import { User } from './../models/user';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RootObj } from '../models/root-obj';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private loggedInStatus = JSON.parse(localStorage.getItem('loggedIn' || 'false'));

  setLoggedIn(value: boolean){
    this.loggedInStatus = value;
    localStorage.setItem('loggedIn', value.toString());
  }

  get isLoggedIn(){
    return this.loggedInStatus;
  }

  constructor(private http: HttpClient, private apiService: ApiService) { }

  get(user: User): Observable<User> {
    return this.http.post<User>(this.apiService.baseURL + `users/signin`, user);
  }
}

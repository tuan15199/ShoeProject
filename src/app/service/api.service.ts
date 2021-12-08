import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  baseURL = 'http://localhost:8080/';
  apiUrls = {
    brands: this.baseURL + 'brands',
    products: this.baseURL + 'simpleProducts',
    productDetails: this.baseURL + 'products',
    saveProduct: this.baseURL + 'product',
    fBrand: this.baseURL + 'products/brand',
  }

  constructor(private http: HttpClient) { }
  get<T>(url: string): Observable<T> {
    return this.http.get<T>(url);
  }

  post<T>(url: string, data: object): Observable<T>{
    return this.http.post<T>(url, data);
  }
  
  put<T>(url: string, data: object): Observable<T>{
    return this.http.put<T>(url, data);
  }

}

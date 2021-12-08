import { Brand } from './../models/brand';
import { Product } from './../models/product';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';
import { RootObj } from '../models/root-obj';
import { Catalog } from '../models/catalog';

@Injectable({
  providedIn: 'root'
})
export class ProductDetailService {

  constructor(private http: HttpClient, private apiService: ApiService) {
    
  }

  getAll(): Observable<RootObj<Product[]>> {
    return this.apiService.get<RootObj<Product[]>>(this.apiService.baseURL + `listDetails`);
  }

  getSize(id: number) {
    let url= this.apiService.baseURL;
    if(id > 0){
      url += `sizes?id=${id}`;
    }
    return this.apiService.get<number[]>(url);
  }

  get(id: number): Observable<RootObj<Product[]>> {
    return this.apiService.get<RootObj<Product[]>>(this.apiService.baseURL + `products/${id}`);
  }

  getDetailByDetailID(id: number): Observable<Product> {
    return this.apiService.get<Product>(this.apiService.baseURL + `productDetail/${id}`);
  }

  getDetailByID(id: number, detailID: number): Observable<RootObj<Product[]>> {
    let url = this.apiService.baseURL + `products/detail/${id}?detailID=${detailID}`
    return this.apiService.get<RootObj<Product[]>>(url);
  }

  getBySize(proId: number, size: number): Observable<RootObj<Product[]>> {
    let url= this.apiService.baseURL + `products/size/${proId}?size=${size}`;
    return this.apiService.get<RootObj<Product[]>>(url);
  }

  getByStatus(status: string, id: number) {
    let url = this.apiService.baseURL + `products/status/${id}/?status=${status}`;
    return this.apiService.get<RootObj<Product[]>>(url);
  } 

  getBySizeAndStatus(proId: number, size: number, status: string) {
    let url = this.apiService.baseURL + `products/status/size/${proId}?size=${size}&status=${status}`;
    return this.apiService.get<RootObj<Product[]>>(url);
  }

  add(product: Product): Observable<RootObj<Product>> {
    return this.apiService.post<RootObj<Product>>(this.apiService.baseURL + `productDetail`, product);
  }

  update(product: Product): Observable<RootObj<Product>> {
    return this.apiService.put<RootObj<Product>>(this.apiService.baseURL + `updateProductDetail`, product);
  }
}

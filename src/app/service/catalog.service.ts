import { Brand } from './../models/brand';
import { Catalog } from './../models/catalog';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { RootObj } from '../models/root-obj';

@Injectable({
  providedIn: 'root'
})
export class CatalogService {

  constructor(private http: HttpClient, private apiService: ApiService) {
    
  }

  getAll(): Observable<RootObj<Catalog[]>> {
    return this.apiService.get<RootObj<Catalog[]>>(this.apiService.baseURL + `catalogs`);
  }

  get(id: number): Observable<RootObj<Catalog>> {
    return this.apiService.get<RootObj<Catalog>>(`${this.apiService.baseURL}catalogs/id=${id}`);
  }

  add(catalog: Catalog): Observable<Catalog> {
    return this.apiService.post<Catalog>(this.apiService.baseURL + `catalog`, catalog)
  }

  addBrand(brand: Brand): Observable<Brand> {
    return this.apiService.post<Brand>(this.apiService.baseURL + `brand`, brand)
  }
}

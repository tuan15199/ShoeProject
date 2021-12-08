import { ProductAdd } from './../models/productAdd';
import { Product } from './../models/product';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';
import { RootObj } from '../models/root-obj';
import { Brand } from '../models/brand';
import { Catalog } from '../models/catalog';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private products: Product[] = [];

  constructor(private http: HttpClient, private apiService: ApiService) {
    
  }

  getAll(): Observable<RootObj<ProductAdd[]>> {
    return this.apiService.get<RootObj<ProductAdd[]>>(this.apiService.apiUrls.products);
  }

  // getByCatalog(id: number) {
  //   let url= this.apiService.apiUrls.products;
  //   if(id > 0){
  //     url += `?id=${id}`;
  //   }
  //   return this.apiService.get<RootObj<Product[]>>(url);
  // }

  getProductById(id: number): Observable<ProductAdd> {
    return this.apiService.get<ProductAdd>(this.apiService.baseURL +`simpleProduct/${id}`);
  }

  add(product: ProductAdd): Observable<RootObj<ProductAdd>> {
    return this.apiService.post<RootObj<ProductAdd>>(this.apiService.apiUrls.saveProduct, product);
  }

  getBrand(): Observable<RootObj<Brand[]>> {
    return this.apiService.get<RootObj<Brand[]>>(this.apiService.apiUrls.brands);
  }

  getCatalog(id: number): Observable<RootObj<Catalog[]>> {
    return this.apiService.get<RootObj<Catalog[]>>(this.apiService.baseURL + `catalogs/brand?brandID=${id}`);
  }

  getAllCatalog():Observable<RootObj<Catalog[]>> {
    return this.apiService.get<RootObj<Catalog[]>>(this.apiService.baseURL + `catalogs`);
  }

  getByBrand(id: number): Observable<RootObj<ProductAdd[]>> {
    return this.apiService.get<RootObj<ProductAdd[]>>(`${this.apiService.apiUrls.fBrand}/${id}`);
  }

  getByBrandAndCatalog(brandID: number, cataID: number): Observable<RootObj<ProductAdd[]>> {
    let url = this.apiService.baseURL + `products/catalog?brand=${brandID}&catalog=${cataID}`;
    return this.apiService.get<RootObj<ProductAdd[]>>(url);
  }

  update(product: ProductAdd): Observable<RootObj<null>> {
    return this.apiService.put<RootObj<null>>(this.apiService.baseURL + `productUpdate/${product.id}`, product);
  }
}

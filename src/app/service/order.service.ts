import { TopProduct } from './../models/topProduct';
import { TopCustomer } from './../models/topCustomer';
import { OrderDetail } from 'src/app/models/orderDetail';
import { OrderDto } from './../models/orderDto';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';
import { Order } from '../models/order';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(private http: HttpClient, private apiService: ApiService) {
    
  }

  getAll(): Observable<Order[]> {
    return this.apiService.get<Order[]>(this.apiService.baseURL + `orders`);
  }

  getAllSuccessOrder(): Observable<Order[]> {
    return this.apiService.get<Order[]>(this.apiService.baseURL + `ordersSuccess`);
  }

  getOrderDetail(id: number): Observable<OrderDetail[]> {
    return this.apiService.get<OrderDetail[]>(this.apiService.baseURL + `orderDetails/${id}`)
  }

  getOrderById(id: number): Observable<Order> {
    return this.apiService.get<Order>(this.apiService.baseURL + `order/${id}`)
  }

  getOrderByTime(fromDate: string, toDate: string): Observable<Order[]> {
    return this.apiService.get<Order[]>(this.apiService.baseURL + 
      `ordersByTime?fromDate=${fromDate}&toDate=${toDate}`)
  }

  getOrderByDate(date: string): Observable<Order[]> {
    return this.apiService.get<Order[]>(this.apiService.baseURL + 
      `ordersByDate?date=${date}`)
  }

  getOrderSuccessByTime(fromDate: string, toDate: string): Observable<Order[]> {
    return this.apiService.get<Order[]>(this.apiService.baseURL + 
      `ordersByTime/deliveried?fromDate=${fromDate}&toDate=${toDate}`)
  }

  getOrderByTimeAndStatus(fromDate: string, toDate: string, status: number): Observable<Order[]> {
    return this.apiService.get<Order[]>(this.apiService.baseURL + 
      `ordersByTimeAndStatus?fromDate=${fromDate}&toDate=${toDate}&status=${status}`)
  }

  getOrderSuccessByDate(date: string): Observable<Order[]> {
    return this.apiService.get<Order[]>(this.apiService.baseURL + 
      `ordersByDate/deliveried?date=${date}`)
  }

  getOrderByDateAndStatus(date: string, status: number): Observable<Order[]> {
    return this.apiService.get<Order[]>(this.apiService.baseURL + 
      `ordersByDateAndStatus?date=${date}&status=${status}`)
  }

  getOrderByStatus(status: number): Observable<Order[]> {
    return this.apiService.get<Order[]>(this.apiService.baseURL + 
      `ordersByStatus?status=${status}`)
  }

  createOrder(order: OrderDto): Observable<OrderDto> {
    return this.apiService.post<OrderDto>(this.apiService.baseURL + `order`, order);
  }

  updateVerified(id: Number, order: Order): Observable<Order> {
    return this.apiService.put<Order>(this.apiService.baseURL + `orderVerified/${id}`, order);
  }

  updateCancel(id: Number, order: Order): Observable<Order> {
    return this.apiService.put<Order>(this.apiService.baseURL + `orderCancel/${id}`, order);
  }

  updateDeliveried(id: Number, order: Order): Observable<Order> {
    return this.apiService.put<Order>(this.apiService.baseURL + `orderDeliveried/${id}`, order);
  }

  getTopCustomers(top: Number, fromDate: string, toDate: string): Observable<TopCustomer[]> {
    return this.apiService.get<TopCustomer[]>(this.apiService.baseURL + 
      `topCustomers?top=${top}&fromDate=${fromDate}&toDate=${toDate}`)
  }

  getTopProducts(top: Number, fromDate: string, toDate: string): Observable<TopProduct[]> {
    return this.apiService.get<TopProduct[]>(this.apiService.baseURL + 
      `topProducts?top=${top}&fromDate=${fromDate}&toDate=${toDate}`)
  }
}

import { Product } from './../../../models/product';
import { Component, OnInit } from '@angular/core';
import { OrderDetailDto } from 'src/app/models/orderDetailDto';
import { OrderDto } from 'src/app/models/orderDto';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-mail',
  templateUrl: './mail.component.html',
  styleUrls: ['./mail.component.css']
})
export class MailComponent implements OnInit {
  customerOrderList: Product[] = [];
  orderList: OrderDetailDto[] = [];
  finalCustomerOrderList: Product[] = [];
  finnalOrderList: OrderDetailDto[] = [];
  orderDto: OrderDto = {} as OrderDto;
  totalPayment = 0;
  today: Date = new Date();
  ordDate = ''

  constructor(private datePipe: DatePipe) {
    this.ordDate = this.datePipe.transform(this.today, 'MM-dd-yyyy');
  }

  ngOnInit(): void {
    var retrievedListItems = localStorage.getItem('orderItems');
    var retrievedOrderList = localStorage.getItem('orderList');
    var retrievedPayment = localStorage.getItem('totalPay');
    var retrievedOrderDto = localStorage.getItem('orderDto');


    this.totalPayment = JSON.parse(retrievedPayment);

    this.customerOrderList = JSON.parse(retrievedListItems);
    this.orderList = JSON.parse(retrievedOrderList);
    this.orderDto = JSON.parse(retrievedOrderDto);

    for (let i = 0; i < this.orderList.length; i++) {
      if (this.orderList[i].quantity != 0) {
        this.finalCustomerOrderList.push(this.customerOrderList[i])
        this.finnalOrderList.push(this.orderList[i])
      }
    }
  }

}

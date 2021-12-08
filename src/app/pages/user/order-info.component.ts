import { OrderService } from './../../service/order.service';
import { OrderDto } from './../../models/orderDto';
import { Component, OnInit } from '@angular/core';
import { OrderDetailDto } from 'src/app/models/orderDetailDto';
import { NgForm } from '@angular/forms';
import { PnotityService } from 'src/app/utils/pnotify.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-order-info',
  templateUrl: './order-info.component.html',
  styleUrls: ['./order-info.component.css']
})
export class OrderInfoComponent implements OnInit {
  orderDto: OrderDto = {} as OrderDto;
  orderList: OrderDetailDto[] = [];
  finnalOrderList: OrderDetailDto[] = [];

  constructor(private orderService: OrderService, private pnotify: PnotityService, 
    private router: Router) { }

  ngOnInit(): void {
    var retrievedOrderList = localStorage.getItem('orderList');
    this.orderList = JSON.parse(retrievedOrderList);
    console.log(this.orderList)

  }

  getFinalOrderList(): OrderDetailDto[]{
    for (let i = 0; i < this.orderList.length; i++) {
      if (this.orderList[i].quantity != 0) {
        this.finnalOrderList.push(this.orderList[i])
      }
    }
    return this.finnalOrderList
  }

  save(f: NgForm) {
    if(f.valid){
      this.pnotify.confirm("Confirm Order", "Click OK to take order", OK => {
        if(OK) {
          this.orderDto.listDetail = this.getFinalOrderList()
          console.log(this.orderDto)
          localStorage.setItem('orderDto', JSON.stringify(this.orderDto));

          this.orderService.createOrder(this.orderDto).subscribe(res => {
            this.orderDto = res
          })
          this.pnotify.success("Ordered", "Order Success")
        }
        else {
          this.pnotify.error("Cancel", "Order Canceled")
          this.router.navigate(['user']);
        }
      })
    }
  }
}

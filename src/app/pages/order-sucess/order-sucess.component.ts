import { Order } from './../../models/order';
import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { Subject } from 'rxjs';
import { PnotityService } from 'src/app/utils/pnotify.service';
import { AutoUnsubscribe } from "ngx-auto-unsubscribe";
import { DataTableDirective } from 'angular-datatables';
import { OrderService } from 'src/app/service/order.service';
import { formatDate } from '@angular/common';

@AutoUnsubscribe()
@Component({
  selector: 'app-order-sucess',
  templateUrl: './order-sucess.component.html',
  styleUrls: ['./order-sucess.component.css']
})
export class OrderSucessComponent implements OnInit {
  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger: any = new Subject();

  orders: Order[] = [];
  order: Order = {} as Order;

  fromDate: Date;
  toDate: Date;

  totalIncome: number = -1;

  constructor(private cdr: ChangeDetectorRef, private orderService: OrderService) { }
  ngOnDestroy(): void {
  }

  ngOnInit(): void {
    this.dtOptions = {
      columnDefs: [{ orderable: false, targets: [0, 1, 2, 3, 7] }],
      order: [[4, 'asc']],
      rowCallback: (row: Node, data: any[] | object, index: number) => {
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
          const info = dtInstance.page.info();
          $('th:first', row).html(`${info.start + index + 1}`);
        });
        return row;
      },
      language: {
        paginate: {
          first: '<i Class="fas fa-step-backward"></i>',
          last: '<i Class="fas fa-step-forward"></i>',
          next: '<i Class="fas fa-forward"></i>',
          previous: '<i Class="fas fa-backward"></i>'
        }
      },
      lengthMenu: [[5, 10, 20, 50, -1], [5, 10, 20, 50, "All"]],
      pagingType: 'full_numbers',
      pageLength: 5
    };
    this.loadData();
  }

  ngAfterViewChecked() {
    this.cdr.detectChanges();
  }

  loadDatatable() {
    try {
      this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
        dtInstance.destroy();
      });
    } catch (error) { }
  }

  loadData() {
    this.loadDatatable()

    this.orderService.getAllSuccessOrder().subscribe(resAll => {
      this.orders = resAll;
      this.dtTrigger.next();
    })
  }

  search() {
    let dateFrom = new Date(this.fromDate)
    let dateTo = new Date(this.toDate)

    if (dateFrom === dateTo) {
      this.orderService.getOrderSuccessByDate(formatDate(dateFrom, 'yyyy-MM-dd 00:00:00', 'en-US'))
        .subscribe(resAll => {
          this.orders = resAll
          this.getIncome(this.orders)
        })
    }
    else {
      this.orderService.getOrderSuccessByTime(
        formatDate(dateFrom, 'yyyy-MM-dd 00:00:00', 'en-US'), formatDate(dateTo, 'yyyy-MM-dd 23:59:59', 'en-US'))
        .subscribe(resAll => {
          this.orders = resAll
          this.getIncome(this.orders)
        })
    }
    this.totalIncome = 0
  }

  getIncome(listOrders: Order[]) {
    for (let i = 0; i < listOrders.length; i++) {
      if (listOrders[i].status === "DELIVERIED")
        this.totalIncome += listOrders[i].totalPrice
    }
  }
}

import { OrderDetail } from 'src/app/models/orderDetail';
import { Order } from './../../models/order';
import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { Subject } from 'rxjs';
import { PnotityService } from 'src/app/utils/pnotify.service';
import { AutoUnsubscribe } from "ngx-auto-unsubscribe";
import { ModalDirective } from 'ngx-bootstrap/modal';
import { DataTableDirective } from 'angular-datatables';
import { NgForm, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FormAction } from './../../enums/form-action.enum';
import { OrderService } from 'src/app/service/order.service';
import { formatDate } from '@angular/common';

@AutoUnsubscribe()
@Component({
  selector: 'app-product',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit {

  @ViewChild('editModal', { static: false }) editModal: ModalDirective;
  @ViewChild('f', { static: true }) f: NgForm;
  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger: any = new Subject();

  orders: Order[] = [];
  order: Order = {} as Order;

  action: String;
  fromDate: Date;
  toDate: Date;
  status = 4;
  totalPotentialSale = 0;

  open: number = 0;
  updateOption = ""

  form: FormGroup;

  constructor(private cdr: ChangeDetectorRef, private orderService: OrderService, private pnotify: PnotityService, private fb: FormBuilder) { }
  ngOnDestroy(): void {
  }

  ngOnInit(): void {
    this.dtOptions = {
      columnDefs: [{ orderable: false, targets: [0, 1, 2, 3, 6, 8] }],
      order: [[5, 'asc']],
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

    this.orderService.getAll().subscribe(resAll => {
      this.orders = resAll;
      this.getIncome(this.orders)
      this.dtTrigger.next();
    })
  }

  getIncome(listOrders: Order[]) {
    this.totalPotentialSale = 0
    for (let i = 0; i < listOrders.length; i++) {
      this.totalPotentialSale += listOrders[i].totalPrice
    }
  }

  search() {
    let dateFrom = new Date(this.fromDate)
    let dateTo = new Date(this.toDate)

    if (this.status == 4) {
      if (dateFrom === dateTo) {
        this.orderService.getOrderByDate(formatDate(dateFrom, 'yyyy-MM-dd 00:00:00', 'en-US'))
          .subscribe(resAll => {
            this.orders = resAll
            this.getIncome(this.orders)
          })
      }
      else {
        this.orderService.getOrderByTime(
          formatDate(dateFrom, 'yyyy-MM-dd 00:00:00', 'en-US'), formatDate(dateTo, 'yyyy-MM-dd 23:59:59', 'en-US'))
          .subscribe(resAll => {
            this.orders = resAll
            this.getIncome(this.orders)
          })
      }
    }
    else {
      if(this.fromDate == null || this.toDate == null) {
        this.getOrderByStatus()
      }
      else {
        if (dateFrom === dateTo) {
          this.orderService.getOrderByDateAndStatus(formatDate(dateFrom, 'yyyy-MM-dd 00:00:00', 'en-US'), this.status)
            .subscribe(resAll => {
              this.orders = resAll
              this.getIncome(this.orders)
            })
        }
        else {
          this.orderService.getOrderByTimeAndStatus(
            formatDate(dateFrom, 'yyyy-MM-dd 00:00:00', 'en-US'), 
            formatDate(dateTo, 'yyyy-MM-dd 23:59:59', 'en-US'), this.status)
            .subscribe(resAll => {
              this.orders = resAll
              this.getIncome(this.orders)
            })
        }
      }
    }
  }

  edit() {
    this.open++
    if (this.open === 2)
      this.close()
  }

  close() {
    this.open = 0;
  }

  getOrderById(id: number): Order {
    this.orderService.getOrderById(id).subscribe(res => {
      this.order = res
    })
    return this.order
  }

  getOrderByStatus() {
    if (this.status == 4)
      this.loadData()
    else {
      this.orderService.getOrderByStatus(this.status).subscribe(res => {
        this.orders = res
      })
    }
  }

  updateVerified(id: number) {
    this.orderService.updateVerified(id, this.getOrderById(id)).subscribe(res => {
      this.order == res
      this.loadData()
    })
  }

  updateCancel(id: number) {
    this.orderService.updateCancel(id, this.getOrderById(id)).subscribe(res => {
      this.order == res
      this.loadData()
    })
  }

  updateDeliveried(id: number) {
    this.orderService.updateDeliveried(id, this.getOrderById(id)).subscribe(res => {
      this.order == res
      this.loadData()
    })
  }

  updateOrder(id: number) {
    switch (this.updateOption) {
      case "1": {
        this.updateVerified(id)
        break;
      }
      case "2": {
        this.updateCancel(id)
        break;
      }
      case "3": {
        this.updateDeliveried(id)
        break;
      }
    }
  }
}

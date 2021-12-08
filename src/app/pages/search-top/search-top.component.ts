import { TopProduct } from './../../models/topProduct';
import { TopCustomer } from './../../models/topCustomer';
import { formatDate } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { OrderService } from 'src/app/service/order.service';
import { PnotityService } from 'src/app/utils/pnotify.service';

@Component({
  selector: 'app-search-top',
  templateUrl: './search-top.component.html',
  styleUrls: ['./search-top.component.css']
})
export class SearchTopComponent implements OnInit {
  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger: any = new Subject();

  customers: TopCustomer[] = [];
  products: TopProduct[] = [];
  topType = 1;
  top = 5;
  type = "";
  tableSelected = 0

  fromDate: Date;
  toDate: Date;

  constructor(private cdr: ChangeDetectorRef, private orderService: OrderService,
    private pnotify: PnotityService) { }

  ngOnInit(): void {
    this.dtOptions = {
      columnDefs: [{ orderable: false, targets: [] }],
     
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

  ngOnDestroy(): void {
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

    this.orderService.getTopCustomers(5, formatDate('2020-01-01', 'yyyy-MM-dd 00:00:00', 'en-US'), formatDate('2020-12-31', 'yyyy-MM-dd 23:59:59', 'en-US')).subscribe(resAll => {
      this.customers = resAll;
      this.dtTrigger.next();
    })

    this.type = "Customer"
  }

  search() {
    console.log(this.top)
    console.log(this.topType)

    this.tableSelected = this.topType

    if (this.fromDate != null && this.toDate != null) {
      let dateFrom = new Date(this.fromDate)
      let dateTo = new Date(this.toDate)
      if (this.topType == 2) {
        this.orderService.getTopProducts(this.top,
          formatDate(dateFrom, 'yyyy-MM-dd 00:00:00', 'en-US'),
          formatDate(dateTo, 'yyyy-MM-dd 23:59:59', 'en-US')).subscribe(resAll => {
            this.products = resAll
          })
          this.type = "Product"
      }
      else {
        this.orderService.getTopCustomers(this.top,
          formatDate(dateFrom, 'yyyy-MM-dd 00:00:00', 'en-US'),
          formatDate(dateTo, 'yyyy-MM-dd 23:59:59', 'en-US')).subscribe(resAll => {
            this.customers = resAll
          })
          this.type = "Customer"
      }
    }
    else {
      this.pnotify.error("Time Invalid", "You must select a range of time");
    }
  }
}

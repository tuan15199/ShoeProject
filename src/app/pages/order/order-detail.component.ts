import { OrderDetail } from 'src/app/models/orderDetail';
import { OrderService } from 'src/app/service/order.service';
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.css']
})
export class OrderDetailComponent implements OnInit {
  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger: any = new Subject();

  orderDetails: OrderDetail[] = [];

  cusName = ""
  ordDate = ""
  deliDate = ""

  orderId: number = +this.route.snapshot.paramMap.get('id');

  constructor(private cdr: ChangeDetectorRef, private route: ActivatedRoute, private orderService: OrderService) { }

  ngOnInit(): void {
    this.dtOptions = {
      columnDefs: [{ orderable: false, targets: [0, 1, 2] }],
      order: [[3, 'asc']],
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
      lengthMenu: [[10, 20, 50, -1], [10, 20, 50, "All"]],
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

    this.orderService.getOrderDetail(this.orderId).subscribe(resAll => {
      this.orderDetails = resAll;
      this.cusName = this.orderDetails[0].firstName + " " + this.orderDetails[0].lastName
      this.ordDate = this.orderDetails[0].orderDate.toString()
      if(this.orderDetails[0].deliveryDate != null)
        this.deliDate = this.orderDetails[0].deliveryDate.toString()
      else
        this.deliDate = "N/A"
      this.dtTrigger.next();
    })
    console.log(this.cusName)
    console.log(this.ordDate)
  }

}

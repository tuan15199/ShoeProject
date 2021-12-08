import { ProductAdd } from './../../models/productAdd';
import { ProductDetailService } from './../../service/product-detail.service';
import { ProductService } from './../../service/product.service';
import { Product } from './../../models/product';
import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { Subject } from 'rxjs';
import { PnotityService } from 'src/app/utils/pnotify.service';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { DataTableDirective } from 'angular-datatables';
import { NgForm, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FormAction } from './../../enums/form-action.enum';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit {

  @ViewChild('editModal', { static: false }) editModal: ModalDirective;
  @ViewChild('detailModel', { static: false }) detailModel: ModalDirective;
  @ViewChild('f', { static: true }) f: NgForm;
  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger: any = new Subject();

  productId: number = +this.route.snapshot.paramMap.get('id');

  sizes: number[] = [];
  status: string[] = ['All', 'Available', 'SoldOut'];

  size: number = 0;
  statusValue: string = 'All';

  stringAPI: string = ''

  products: Product[] = [];
  product: Product = {} as Product;
  productAdd: ProductAdd = {} as ProductAdd;

  action: String;
  form: FormGroup;

  modalOption: number = 0;

  constructor(private cdr: ChangeDetectorRef, private productDetailService: ProductDetailService,
    private productService: ProductService,
    private pnotify: PnotityService, private fb: FormBuilder,
    private route: ActivatedRoute, private router: Router) { }
  ngOnDestroy(): void {
  }

  ngOnInit(): void {
    this.dtOptions = {
      columnDefs: [{ orderable: false, targets: [0, 1, 7] }],
      order: [[2, 'asc']],
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

    this.productDetailService.getSize(this.productId).subscribe(res => {
      this.sizes = res;
    })

    this.productService.getProductById(this.productId).subscribe(res => {
      this.productAdd = res
    })

    this.loadData(this.productId);

    //build form
    this.product.productId = this.productId
    this.form = this.fb.group({
      detailID: [{ value: this.product.detailID }],
      productId: [{ value: this.product.productId }],
      catalogID: [{ value: this.product.catalogID }],
      name: [{ value: this.product.name }],
      price: [{ value: this.product.price }],
      color: [{ value: this.product.color }, Validators.compose([Validators.required])],
      size: [{ value: this.product.size }, Validators.compose([Validators.required])],
      genderType: [{ value: this.product.genderType }, Validators.compose([Validators.required])],
      star: [{ value: this.product.star }],
      type: [{ value: this.product.type }],
      brand: [{ value: this.product.brand }],
      status: [{ value: this.product.brand }],
    });

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

  loadData(id: number) {
    this.loadDatatable()

    this.productDetailService.get(+id).subscribe(resAll => {
      this.products = resAll.data;
      this.dtTrigger.next();
    })
  }

  selectedModal(id: number) {
    if (id === 0) {
      this.modalOption = 0;
    }
    else {
      this.modalOption = 1;
    }
  }

  showModal(id: number) {
    this.form.reset();
    if (id === 0) {
      this.action = FormAction.ADD;
      this.product = { productId: 0 } as Product;
      this.editModal.show();
    }
    else {
      this.action = FormAction.EDIT;
      this.productDetailService.getDetailByID(this.productId, id).subscribe(res => {
        this.product = res.data[0];
        if (this.product.picture1 === null) {
          this.product.picture1 = "assets/img/admin-icon.jpg"
        }
        if (this.product.picture2 === null) {
          this.product.picture2 = "assets/img/admin-icon.jpg"
        }
        if (this.product.picture3 === null) {
          this.product.picture3 = "assets/img/admin-icon.jpg"
        }
        this.editModal.show();
      })
    }
  }

  hideModal() {
    this.modalOption = 0
    this.editModal.hide();
  }

  save() {
    this.product.productId = this.productId
    
    if (this.product.detailID > 0) {
      this.productDetailService.update(this.product).subscribe(res => {
        this.hideModal();
        this.loadData(this.productId)
      });

    }
    else {
      this.productDetailService.add(this.product).subscribe(res => {
        this.hideModal();
        this.loadData(this.productId)
      })
    }
    this.pnotify.success("200 OK", "add succed");
  }

  selectedSize() {
    this.loadDatatable()

    this.productDetailService.getBySize(this.productId, this.size).subscribe(res => {
      this.products = res.data;
      this.dtTrigger.next();
    })
  }

  selectedStatus() {
    this.loadDatatable()

    if (this.statusValue === 'Available' || this.statusValue === 'All') {
      this.productDetailService.getByStatus('Available', this.productId).subscribe(res => {
        this.products = res.data;
        this.dtTrigger.next();
      })
    }
    else {
      this.productDetailService.getByStatus('SoldOut', this.productId).subscribe(res => {
        this.products = res.data;
        this.dtTrigger.next();
      })
    }
  }

  getBySizeAndStatus() {
    this.loadDatatable()

    this.productDetailService.getBySizeAndStatus(this.productId, this.size, this.statusValue).subscribe(res => {
      this.products = res.data;
      this.dtTrigger.next();
    })
  }

  getStringAPI() {
    if (this.size > 0 && !this.stringAPI.includes('size')) {
      this.stringAPI += 'size';
    }
    if (this.statusValue != null && this.size > 0)
      this.stringAPI = 'size' + this.statusValue
    else
      this.stringAPI = this.statusValue
  }


  filter() {
    this.getStringAPI()
    console.log(this.stringAPI)
    if (this.stringAPI === 'Available' || this.stringAPI === 'SoldOut')
      this.selectedStatus()
    if (this.stringAPI === 'size' || this.stringAPI === 'sizeAll')
      this.selectedSize()
    if (this.stringAPI === 'sizeAvailable' || this.stringAPI === 'sizeSoldOut')
      this.getBySizeAndStatus()
    if (this.stringAPI === 'All')
      this.loadData(this.productId)
  }
}

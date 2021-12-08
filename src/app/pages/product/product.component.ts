import { CatalogService } from './../../service/catalog.service';
import { ProductAdd } from './../../models/productAdd';
import { ProductService } from './../../service/product.service';
import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { Subject } from 'rxjs';
import { PnotityService } from 'src/app/utils/pnotify.service';
import { AutoUnsubscribe } from "ngx-auto-unsubscribe";
import { ModalDirective } from 'ngx-bootstrap/modal';
import { DataTableDirective } from 'angular-datatables';
import { NgForm, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FormAction } from './../../enums/form-action.enum';
import { Brand } from 'src/app/models/brand';
import { Catalog } from 'src/app/models/catalog';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';

@AutoUnsubscribe()
@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {

  @ViewChild('editModal', { static: false }) editModal: ModalDirective;
  @ViewChild('f', { static: true }) f: NgForm;
  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger: any = new Subject();

  brands: Brand[] = [];
  products: ProductAdd[] = [];
  catalogs: Catalog[] = [];
  catalogsForModal: Catalog[] = [];

  catalogID = 0;
  brandID = 0;

  action: String;
  productAdd: ProductAdd = {} as ProductAdd;
  stringAPI: string = '';

  form: FormGroup;

  constructor(private cdr: ChangeDetectorRef, private productService: ProductService, 
    private pnotify: PnotityService, private fb: FormBuilder, private cookie: CookieService,
    private catalogService: CatalogService, private router: Router) { }
  ngOnDestroy(): void {
  }

  ngOnInit(): void {
    this.dtOptions = {
      columnDefs: [{ orderable: false, targets: [0, 1, 3, 4, 5] }],
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
    this.loadData();

    this.productService.getBrand().subscribe(resAll => {
      this.brands = resAll.data;
    })
    this.productAdd.brandId = 0;

    //build form
    this.form = this.fb.group({
      catalogId: [{ value: this.productAdd.catalogId }, Validators.compose([Validators.required])],
      name: [{ value: this.productAdd.name }, Validators.compose([Validators.required, Validators.minLength(3)])],
      price: [{ value: this.productAdd.price }, Validators.compose([Validators.required])],
      catalog: [{ value: this.productAdd.type }, Validators.compose([Validators.required])],
      brandId: [{ value: this.productAdd.brandId }]
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

  loadData() {
    this.loadDatatable()

    this.productService.getAll().subscribe(resAll => {
      this.products = resAll.data;
      this.dtTrigger.next();
    }, err => {
      if(err.status == 500){
        this.cookie.deleteAll()
        this.router.navigate(['/login']);
      }
    })
  }

  selectedBrand() {
    this.loadDatatable()

    this.productService.getByBrand(this.brandID).subscribe(res => {
      this.products = res.data
      this.dtTrigger.next();
    })
  }

  // getBrandID() {
  //   this.productService.getByBrand(this.brandID)
  // }

  getCatalog() {
    this.productService.getAllCatalog().subscribe(resAll => {
      this.catalogsForModal = resAll.data;
    })
  }

  selectedCatalogFromBrand() {
    this.productService.getAllCatalog().subscribe(resAll => {
      this.catalogs = resAll.data;
      console.log(resAll)
    })
  }

  selectedByBrandAndCatalog() {
    this.loadDatatable()

    this.productService.getByBrandAndCatalog(this.brandID, this.catalogID).subscribe(resALl => {
      this.products = resALl.data
      this.dtTrigger.next();
    })
  }

  showModal(id: number) {
    this.form.reset();

    if (id === 0) {
      this.action = FormAction.ADD;
      this.productAdd.brandId = 0
      this.productAdd = { id: 0 } as ProductAdd;
      this.editModal.show();
    }
    else {
      this.action = FormAction.EDIT;
      this.productService.getProductById(+id).subscribe(res => {
        this.productAdd = res;
        this.editModal.show();
        console.log(this.productAdd)
      })
    }
  }

  hideModal() {
    this.editModal.hide();
    this.loadData()
  }

  save() {
    if (this.productAdd.price >= 0) {
      if (this.productAdd.id === 0) {
        this.productService.add(this.productAdd).subscribe(res => {
          this.hideModal();
        })
      }
      else {
        this.productService.update(this.productAdd).subscribe(res => {
          this.hideModal();
        });
      }
      this.pnotify.success("200 OK", "add succed");
    } else {
        this.pnotify.error("Price error", "price must greater than 0")
    }
  }

  getStringAPI() {
    if (this.brandID > 0) {
      this.stringAPI = 'brand';
    }
    if (this.catalogID > 0 && this.catalogID > 0)
      this.stringAPI = 'brand' + 'catalog'
      console.log(this,this.catalogID)
  }


  filter() {
    this.getStringAPI()
    console.log(this.stringAPI)
    if (this.stringAPI === 'brand')
      this.selectedBrand()
    if (this.stringAPI === 'brandcatalog')
      this.selectedByBrandAndCatalog()
  }

  catalog: Catalog = {} as Catalog
  createCatalog() {
    this.catalogService.add(this.catalog).subscribe(res => {
      this.catalog = res
      this.loadData()
    })
  }
  
  brand: Brand = {} as Brand
  createBrand() {
    this.catalogService.addBrand(this.brand).subscribe(res => {
      this.brand = res
      this.loadData()
    })
  }

}

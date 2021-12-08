import { OrderDetailDto } from './../../models/orderDetailDto';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Product } from 'src/app/models/product';
import { ProductDetailService } from 'src/app/service/product-detail.service';
import { ProductService } from 'src/app/service/product.service';
import { PnotityService } from 'src/app/utils/pnotify.service';
import { ModalDirective } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  @ViewChild('editModal', { static: false }) editModal: ModalDirective;
  @ViewChild('f', { static: true }) f: NgForm;
  products: Product[] = [];
  product: Product = {} as Product;
  listProductInCart: Product[] = [];

  cartItemNumber: number = 0;
  sumQuantity = 0;
  totalPayment = 0;

  orderList: OrderDetailDto[] = [];
  idArray: Number[] = [];

  form: FormGroup;

  constructor(private productDetailService: ProductDetailService, private pnotify: PnotityService,
    private productService: ProductService, private fb: FormBuilder, private router: Router) { }

  ngOnInit(): void {
    this.loadData()

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
      status: [{ value: this.product.brand }]
    });
  }

  loadData() {
    this.productDetailService.getAll().subscribe(resAll => {
      this.products = resAll.data;
    })
    this.getFromLocalStorage()
  }

  addToCard(id: number) {
    let count: number = 0;
    let orderDetail: OrderDetailDto = { productDetailID: id, quantity: 1 };

    for (let detail of this.listProductInCart) {
      if (detail.detailID == id) {
        count++;
        this.pnotify.error("Already Added", "You already add " + detail.name + " product to your shopping");
      }
    }
    if (count == 0) {
      this.orderList.push(orderDetail);
      this.pnotify.success("Added", "you've just added this product to your cart");
      this.cartItemNumber++;

      let cartProduct: Product = {} as Product
      this.productDetailService.getDetailByDetailID(id).subscribe(res => {
        cartProduct = res
        this.listProductInCart.push(cartProduct)
        this.totalPayment += cartProduct.price * orderDetail.quantity
        this.setToLocalStorage()
      })
    }
  }

  setToLocalStorage() {
    localStorage.setItem('orderItems', JSON.stringify(this.listProductInCart));
    localStorage.setItem('itemNumber', JSON.stringify(this.cartItemNumber));
    localStorage.setItem('orderList', JSON.stringify(this.orderList));
    localStorage.setItem('totalPay', JSON.stringify(this.totalPayment));
  }

  getFromLocalStorage() {
    var retrievedListItems = localStorage.getItem('orderItems');
    var retrievedItemsNumber = localStorage.getItem('itemNumber');
    var retrievedOrderList = localStorage.getItem('orderList');
    var retrievedPayment = localStorage.getItem('totalPay');

    if (JSON.parse(retrievedItemsNumber) > 0) {
      this.listProductInCart = JSON.parse(retrievedListItems);
      this.cartItemNumber = JSON.parse(retrievedItemsNumber);
      this.orderList = JSON.parse(retrievedOrderList);
      this.totalPayment = JSON.parse(retrievedPayment);
    }
  }

  hideModal() {
    this.setToLocalStorage()
    this.editModal.hide();
  }

  getDetailByDetailID(id: number): Product {
    this.productDetailService.getDetailByDetailID(id).subscribe(rest => {
      this.product = rest
    })
    return this.product
  }

  showModal() {
    this.getFromLocalStorage()
    this.editModal.show();
  }

  order() {
    this.editModal.hide();
    for (let item of this.orderList) {
      this.sumQuantity += item.quantity;
    }
    if (this.listProductInCart.length === 0) {
      this.pnotify.confirm("Choose Product", "Please choose at least one product to take order", OK => {
        if (OK)
          this.loadData()
        else {
          this.editModal.hide();
          this.pnotify.error("Cancel", "Order cancel")
        }
      })
    }

    else {
      if (this.sumQuantity === 0) {
        this.pnotify.confirm("Choose Product", "Please choose at least one product to take order", OK => {
          if (OK)
            this.editModal.show()
          else {
            this.editModal.hide();
            this.pnotify.error("Cancel", "Order cancel")
          }
        })
      }
      else {
        this.router.navigate(['userInfo']);
      }
    }
  }

  save() {
    this.editModal.hide();
  }

  removeFromCart(orderItem: Product) {
    const index: number = this.listProductInCart.indexOf(orderItem);
    this.totalPayment -= this.listProductInCart[index].price * this.orderList[index].quantity;
    this.listProductInCart.splice(index, 1);
    this.orderList.splice(index, 1);
    this.cartItemNumber--;
    this.setToLocalStorage();
  }

  addQuantity(index: number) {
    this.orderList[index].quantity++;
    this.totalPayment += this.listProductInCart[index].price;
    this.setToLocalStorage();
  }

  minusQuantity(index: number) {
    this.orderList[index].quantity--;

    if (this.orderList[index].quantity < 0) {
      this.orderList[index].quantity = 0;
      this.totalPayment -= 0;
    }
    else {
      this.totalPayment -= this.listProductInCart[index].price;
    }
    this.setToLocalStorage();
  }

}

export interface OrderDetail {
  orderDetailId:number;
	firstName: string;
  lastName: string;
	orderDate: Date;
  deliveryDate: Date;
  product: string;
  quantity: number;
	totalPrice: number;
}

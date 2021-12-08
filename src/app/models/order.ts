export interface Order {
  id:number;
	firstName: string;
	lastName: string;
	phone: string;
	email: string;
	address: string;
	totalPrice: number;
	status: string;
	orderDate: Date;
	deliveryDate: Date;
}

import { OrderDetailDto } from './orderDetailDto';
export interface OrderDto {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  address: string;
  listDetail: OrderDetailDto[];
}

export interface RootObj<T> {
  errorCode: number;
  data: T;
  message: string;
}
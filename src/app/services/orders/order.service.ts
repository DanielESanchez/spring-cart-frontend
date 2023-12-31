import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(private http: HttpClient) { }

  saveNewOrder(username: any) {
    return this.http.post<any>(`${environment.API_URL}order/new/${username}`, null, { observe: "response" });
  }

  buyOrder(orderId: any) {
    return this.http.patch<any>(`${environment.API_URL}order/buy/${orderId}`, null);
  }

  getOrder(orderId: any) {
    return this.http.get<any>(`${environment.API_URL}order/get/${orderId}`);
  }

  cancelOrder(orderId: any) {
    return this.http.patch<any>(`${environment.API_URL}order/cancel/${orderId}`, null);
  }

  refundOrder(orderId: any) {
    return this.http.patch<any>(`${environment.API_URL}order/refund/${orderId}`, null);
  }

  completeOrder(orderId: any) {
    return this.http.patch<any>(`${environment.API_URL}order/complete/${orderId}`, null);
  }

  getOrdersUser(username: any) {
    return this.http.get<any>(`${environment.API_URL}orders/get/${username}`);
  }

  getAllOrdersAdmin() {
    return this.http.get<any>(`${environment.API_URL}orders/all/get`);
  }

  cancelOrderAdmin(_idOrder: string) {
    return this.http.patch<any>(`${environment.API_URL}order/cancel/${_idOrder}`, null);
  }

  completeOrderAdmin(_idOrder: string) {
    return this.http.patch<any>(`${environment.API_URL}order/complete/${_idOrder}`, null);
  }

  refundOrderAdmin(_idOrder: string) {
    return this.http.patch<any>(`${environment.API_URL}order/refund/${_idOrder}`, null);
  }
}

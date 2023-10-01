import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  constructor(private http: HttpClient) {
  }

  saveNewCart(cart: any) {
    return this.http.post<any>(`${environment.API_URL}cart/new`, cart, { observe: "response" });
  }

  deleteCart(username: string) {
    return this.http.delete<any>(`${environment.API_URL}cart/delete/${username}`);
  }

  addToCart(product: any, username: string) {
    return this.http.patch<any>(`${environment.API_URL}cart/add/${username}`, product)
  }

  getCart(username: string) {
    return this.http.get<any>(`${environment.API_URL}cart/get/${username}`);
  }
  
}

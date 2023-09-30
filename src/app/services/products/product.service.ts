import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private http: HttpClient) { }

  saveNewProduct(product: any) {
    return this.http.post<any>(`${environment.API_URL}product/new`, product, { observe: "response" });
  }

  deleteProduct(productId: string) {
    return this.http.delete<any>(`${environment.API_URL}product/delete/${productId}`);
  }

  getAllProducts() {
    return this.http.get<any>(`${environment.API_URL}products`);
  }

  getAllProductsAdmin() {
    return this.http.get<any>(`${environment.API_URL}admin/products`);
  }

  disableProduct(productId: string) {
    return this.http.patch<any>(`${environment.API_URL}product/disable/${productId}`, null);
  }

  enableProduct(productId: string) {
    return this.http.patch<any>(`${environment.API_URL}product/enable/${productId}`, null);
  }

  getProductByIdAdmin(productId: string){
    return this.http.get<any>(`${environment.API_URL}product/admin/get/${productId}`);
  }
}

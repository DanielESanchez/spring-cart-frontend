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

  deleteProduct(productId: any){
    return this.http.delete<any>(`${environment.API_URL}product/delete/${productId}`);
  }

}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.development';
import { HttpParams } from "@angular/common/http";

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

  getProductByIdAdmin(productId: string) {
    return this.http.get<any>(`${environment.API_URL}product/admin/get/${productId}`);
  }

  getProductById(productId: string) {
    return this.http.get<any>(`${environment.API_URL}product/get/${productId}`);
  }

  updateProduct(product: any) {
    return this.http.put<any>(`${environment.API_URL}product/update`, product, { observe: "response" });
  }

  searchProduct(searchQuery: string, categoryQuery: string | null | undefined) {
    searchQuery = searchQuery.trim();
    let url = `${environment.API_URL}products/search?category=${categoryQuery}`
    if(!categoryQuery) url = `${environment.API_URL}products/search`
    const options = searchQuery ?
      { params: new HttpParams().set('q', searchQuery)} : {};

    return this.http.get<any>(url, options)
  }
}

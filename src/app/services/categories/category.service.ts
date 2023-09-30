import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(private http: HttpClient) { }

  saveNewCategory(category: any) {
    return this.http.post<any>(`${environment.API_URL}category/new`, category, { observe: "response" });
  }

  getAllCategories() {
    return this.http.get<any>(`${environment.API_URL}category/all/get`);
  }

  getCategoryById(categoryId: string) {
    return this.http.get<any>(`${environment.API_URL}category/get/${categoryId}`);
  }

  updateCategory(category: any) {
    return this.http.put<any>(`${environment.API_URL}category/update`, category);
  }

  deleteCategory(categoryId: string) {
    return this.http.delete<any>(`${environment.API_URL}category/delete/${categoryId}`);
  }

  disableCategory(categoryId: string) {
    return this.http.patch<any>(`${environment.API_URL}category/disable/${categoryId}`, null);
  }

  enableCategory(categoryId: string) {
    return this.http.patch<any>(`${environment.API_URL}category/enable/${categoryId}`, null);
  }
}

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
}

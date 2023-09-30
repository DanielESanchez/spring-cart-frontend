import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {

  constructor(private http: HttpClient) { }

  saveNewReview(review: any) {
    return this.http.post<any>(`${environment.API_URL}review/new`, review, { observe: "response" });
  }

  getAllReviewsForProductId(productId: string) {
    return this.http.get<any>(`${environment.API_URL}reviews/product/get/${productId}`);
  }

  getReviewCategoryById(reviewId: string) {
    return this.http.get<any>(`${environment.API_URL}review/get/${reviewId}`);
  }
}

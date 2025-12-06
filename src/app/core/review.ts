import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Review {
  id?: string;
  productId: string;
  userId: string;
  userName?: string;
  rating: number;
  comment: string;
   createdAt?: string | Date;
}

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  private baseUrl = 'http://localhost:8080/api/reviews';

  constructor(private http: HttpClient) {}

  private getAuthHeaders(token: string) {
    return { headers: new HttpHeaders({ Authorization: `Bearer ${token}` }) };
  }

 getReviews(productId: string, token: string): Observable<Review[]> {
  return this.http.get<Review[]>(
    `${this.baseUrl}/product/${productId}`,
    this.getAuthHeaders(token)
  );
}



  addReview(review: Review, token: string): Observable<Review> {
    return this.http.post<Review>(this.baseUrl, review, this.getAuthHeaders(token));
  }

  updateReview(reviewId: string, review: Review, token: string): Observable<Review> {
    return this.http.put<Review>(`${this.baseUrl}/${reviewId}`, review, this.getAuthHeaders(token));
  }

  deleteReview(reviewId: string, token: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${reviewId}`, this.getAuthHeaders(token));
  }
}

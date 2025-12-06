import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface OrderItem {
  productId: string;
  productName: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  total: number;
  status: string;
  createdAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private baseUrl = 'http://localhost:8080/api/orders';

  constructor(private http: HttpClient) {}

  private getAuthHeaders(token: string) {
    return { headers: new HttpHeaders({ Authorization: `Bearer ${token}` }) };
  }

  getOrdersForUser(userId: string, token: string): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.baseUrl}/user/${userId}`, this.getAuthHeaders(token));
  }

  createOrder(orderData: { userId: string; items: OrderItem[]; total: number }, token: string): Observable<Order> {
    return this.http.post<Order>(`${this.baseUrl}/create`, orderData, this.getAuthHeaders(token));
  }

  updateOrderStatus(orderId: string, status: string, token: string): Observable<Order> {
    return this.http.put<Order>(`${this.baseUrl}/${orderId}/status/${status}`, null, this.getAuthHeaders(token));
  }

  getOrderById(orderId: string, token: string): Observable<Order> {
    return this.http.get<Order>(`${this.baseUrl}/${orderId}`, this.getAuthHeaders(token));
  }
}

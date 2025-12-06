import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from './product';

export interface CartItem {
  productId: string;
  productName: string;
  price: number;
  quantity: number;
}

export interface Cart {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private baseUrl = 'http://localhost:8080/api/cart';

  constructor(private http: HttpClient) {}

  private getAuthHeaders(token: string) {
    return { headers: new HttpHeaders({ Authorization: `Bearer ${token}` }) };
  }

  // ---------- Guest Cart in localStorage ----------
  getLocalCart(): CartItem[] {
    const data = localStorage.getItem('guest_cart');
    return data ? JSON.parse(data) : [];
  }

  saveLocalCart(items: CartItem[]) {
    localStorage.setItem('guest_cart', JSON.stringify(items));
  }

  // ---------- Common methods ----------
  getCart(userId?: string, token?: string): Observable<Cart> {
    if (!userId || !token) {
      // Guest cart
      return new Observable<Cart>(observer => {
        const items = this.getLocalCart();
        observer.next({ id: 'guest', userId: 'guest', items, total: items.reduce((s,i)=>s+i.price*i.quantity,0) });
        observer.complete();
      });
    }
    // Logged-in cart from backend
    return this.http.get<Cart>(`${this.baseUrl}/${userId}`, this.getAuthHeaders(token));
  }

  addToCart(product: Product, quantity: number, userId?: string, token?: string): Observable<Cart> {
    if (!userId || !token) {
      const items = this.getLocalCart();
      const existing = items.find(i => i.productId === product.id);
      if (existing) existing.quantity += quantity;
      else items.push({ productId: product.id, productName: product.name, price: product.price, quantity });
      this.saveLocalCart(items);

      return new Observable<Cart>(observer => {
        observer.next({ id: 'guest', userId: 'guest', items, total: items.reduce((s,i)=>s+i.price*i.quantity,0) });
        observer.complete();
      });
    }

    return this.http.post<Cart>(
      `${this.baseUrl}/${userId}/add`,
      { productId: product.id, productName: product.name, price: product.price, quantity },
      this.getAuthHeaders(token)
    );
  }

  updateItem(productId: string, quantity: number, userId?: string, token?: string): Observable<Cart> {
    if (!userId || !token) {
      const items = this.getLocalCart();
      const item = items.find(i => i.productId === productId);
      if (item) item.quantity = quantity;
      this.saveLocalCart(items);

      return new Observable<Cart>(observer => {
        observer.next({ id: 'guest', userId: 'guest', items, total: items.reduce((s,i)=>s+i.price*i.quantity,0) });
        observer.complete();
      });
    }

    return this.http.put<Cart>(
      `${this.baseUrl}/${userId}/update/${productId}`,
      { quantity },
      this.getAuthHeaders(token)
    );
  }

  removeItem(productId: string, userId?: string, token?: string): Observable<Cart> {
    if (!userId || !token) {
      let items = this.getLocalCart();
      items = items.filter(i => i.productId !== productId);
      this.saveLocalCart(items);

      return new Observable<Cart>(observer => {
        observer.next({ id: 'guest', userId: 'guest', items, total: items.reduce((s,i)=>s+i.price*i.quantity,0) });
        observer.complete();
      });
    }

    return this.http.delete<Cart>(
      `${this.baseUrl}/${userId}/remove/${productId}`,
      this.getAuthHeaders(token)
    );
  }
  clearCart(userId?: string, token?: string): Observable<Cart> {
  if (!userId || !token) {
    // Guest cart
    localStorage.removeItem('guest_cart');
    return new Observable<Cart>(observer => {
      observer.next({ id: 'guest', userId: 'guest', items: [], total: 0 });
      observer.complete();
    });
  }

  // Logged-in cart (backend)
  return this.http.delete<Cart>(
    `${this.baseUrl}/${userId}/clear`,
    this.getAuthHeaders(token)
  );
}

}


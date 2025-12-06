import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { AuthService } from './auth';
import { Product } from './product';
import { tap } from 'rxjs/operators';
import { ProductService } from './product';

@Injectable({
  providedIn: 'root'
})
export class WishlistService {
  private baseUrl = 'http://localhost:8080/api/wishlist';
  private _wishlist = new BehaviorSubject<Product[]>([]);
  public wishlist$ = this._wishlist.asObservable();

  constructor(private http: HttpClient, private auth: AuthService,private productService: ProductService) {}

  private getHeaders(): HttpHeaders {
    const token = this.auth.getToken(); // implement getToken in AuthService
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }

  loadWishlist(): void {
  const user = this.auth.getCurrentUser();
  if (!user) return;

  this.http
    .get<{ productIds: string[] }>(`${this.baseUrl}/${user.id}`, { headers: this.getHeaders() })
    .subscribe(wishlist => {
      const productIds = wishlist.productIds || [];
      this._wishlist.next([]);
      productIds.forEach(id => {
        this.productService.getProductById(id).subscribe(p => {
          this._wishlist.next([...this._wishlist.value, p]);
        });
      });
    });
}



  add(product: Product): void {
    const user = this.auth.getCurrentUser();
    if (!user) return;

    this.http.post<string[]>(`${this.baseUrl}/${user.id}/${product.id}`, {}, { headers: this.getHeaders() })
      .subscribe(() => this.loadWishlist());
  }

  remove(productId: string): void {
    const user = this.auth.getCurrentUser();
    if (!user) return;

    this.http.delete<string[]>(`${this.baseUrl}/${user.id}/${productId}`, { headers: this.getHeaders() })
      .subscribe(() => this.loadWishlist());
  }

  toggle(product: Product): void {
    const current = this._wishlist.value;
    if (current.find(p => p.id === product.id)) {
      this.remove(product.id);
    } else {
      this.add(product);
    }
  }

  isFavorite(productId: string): boolean {
    return !!this._wishlist.value.find(p => p.id === productId);
  }

  clear(): void {
    const user = this.auth.getCurrentUser();
    if (!user) return;

    this.http.delete(`${this.baseUrl}/clear/${user.id}`, { headers: this.getHeaders() })
      .subscribe(() => this._wishlist.next([]));
  }
}

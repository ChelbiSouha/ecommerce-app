import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Product } from './product'; 


@Injectable({
  providedIn: 'root'
})
export class WishlistService {
  private wishlistKey = 'wishlist';

  private _wishlist = new BehaviorSubject<Product[]>(this.loadWishlist());
  public wishlist$ = this._wishlist.asObservable();

  constructor() {}

  private loadWishlist(): Product[] {
    const stored = localStorage.getItem(this.wishlistKey);
    return stored ? JSON.parse(stored) : [];
  }

  private saveWishlist(items: Product[]) {
    localStorage.setItem(this.wishlistKey, JSON.stringify(items));
    this._wishlist.next(items);
  }

  add(product: Product) {
    const current = this._wishlist.value;
    if (!current.find(p => p.id === product.id)) {
      this.saveWishlist([...current, product]);
    }
  }

  remove(productId: number) {
    const filtered = this._wishlist.value.filter(p => p.id !== productId);
    this.saveWishlist(filtered);
  }

  toggle(product: Product) {
    const current = this._wishlist.value;
    if (current.find(p => p.id === product.id)) {
      this.remove(product.id);
    } else {
      this.add(product);
    }
  }

  isFavorite(productId: number): boolean {
    return !!this._wishlist.value.find(p => p.id === productId);
  }
}

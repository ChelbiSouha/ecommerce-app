import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { CartService, CartItem } from '../../../core/cart';
import { AuthService, LoggedUser } from '../../../core/auth';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { Product } from '../../../core/product';
import { RouterModule } from '@angular/router';


@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule,RouterModule, CurrencyPipe, MatButtonModule, MatCardModule, MatIconModule],
  templateUrl: './cart.html',
  styleUrls: ['./cart.scss'],
})
export class Cart implements OnInit {
  items: CartItem[] = [];
  shippingFee: number = 5.99;
  user: LoggedUser | null = null;

  constructor(private cartService: CartService, private auth: AuthService) {}

  ngOnInit(): void {
    this.auth.currentUser$.subscribe(user => {
      this.user = user;
      this.loadCart();
    });
  }

  private isLoggedIn(): boolean {
    return !!this.user;
  }

  loadCart() {
    if (this.isLoggedIn()) {
      // Load from backend
      const userId = this.user?.id!;
      const token = this.user?.token!;
      this.cartService.getCart(userId, token).subscribe(cart => {
        this.items = cart.items;
      });
    } else {
      // Load from localStorage for guests
      const stored = localStorage.getItem('guestCart');
      this.items = stored ? JSON.parse(stored) : [];
    }
  }

  saveGuestCart() {
    localStorage.setItem('guestCart', JSON.stringify(this.items));
  }

  addToCart(product: Product, quantity = 1) {
    const itemIndex = this.items.findIndex(i => i.productId === product.id);
    if (itemIndex > -1) {
      this.items[itemIndex].quantity += quantity;
    } else {
      this.items.push({
        productId: product.id,
        productName: product.name,
        price: product.price,
        quantity,
      });
    }

    if (this.isLoggedIn()) {
      const userId = this.user?.id!;
      const token = this.user?.token!;
      this.cartService.addToCart(product, quantity, userId, token).subscribe(cart => {
        this.items = cart.items;
      });
    } else {
      this.saveGuestCart();
    }
  }

  updateQuantity(productId: string, event: any) {
    const qty = +event.target.value;
    const item = this.items.find(i => i.productId === productId);
    if (!item) return;
    item.quantity = qty;

    if (this.isLoggedIn()) {
      const userId = this.user?.id!;
      const token = this.user?.token!;
      this.cartService.updateItem(productId, qty, userId, token).subscribe(cart => {
        this.items = cart.items;
      });
    } else {
      this.saveGuestCart();
    }
  }

  removeItem(productId: string) {
    this.items = this.items.filter(i => i.productId !== productId);

    if (this.isLoggedIn()) {
      const userId = this.user?.id!;
      const token = this.user?.token!;
      this.cartService.removeItem(productId, userId, token).subscribe(cart => {
        this.items = cart.items;
      });
    } else {
      this.saveGuestCart();
    }
  }

  get subtotal(): number {
    return this.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }

  get total(): number {
    return this.subtotal + (this.items.length ? this.shippingFee : 0);
  }

  proceedToCheckout() {
    if (!this.isLoggedIn()) {
      alert('Veuillez vous connecter pour procéder au paiement.');
      return;
    }
    alert('Redirection vers le paiement (mockup)');
  }
}

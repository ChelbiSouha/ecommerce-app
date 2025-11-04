import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { CartService, CartItem } from '../../../core/cart';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-cart',
  imports: [CommonModule, 
    CurrencyPipe, 
    MatButtonModule,
    MatCardModule,
    MatIconModule],
  templateUrl: './cart.html',
  styleUrl: './cart.scss',
})
export class Cart implements OnInit{
  items: CartItem[] = [];
  shippingFee: number = 5.99;

  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    this.loadCart();
  }

  loadCart() {
    this.items = this.cartService.getItems();
  }

  removeItem(productId: number) {
    this.cartService.remove(productId);
    this.loadCart();
  }

  updateQuantity(productId: number, event: any) {
    const qty = +event.target.value;
    this.cartService.updateQuantity(productId, qty);
    this.loadCart();
  }

  get subtotal(): number {
    return this.cartService.getSubtotal();
  }

  get total(): number {
    return this.subtotal + (this.items.length ? this.shippingFee : 0);
  }

  proceedToCheckout() {
    alert('Redirection vers le paiement (mockup)');
  }

}

import { Injectable } from '@angular/core';
import { Product } from './product';

export interface CartItem {
  product: Product;
  quantity: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private items: CartItem[] = [];

  constructor() {
    // Charger le panier depuis localStorage si existant
    const stored = localStorage.getItem('cart');
    if (stored) {
      this.items = JSON.parse(stored);
    }
  }

  // Ajouter un produit au panier
  add(product: Product, quantity: number = 1) {
    const existing = this.items.find(i => i.product.id === product.id);
    if (existing) {
      existing.quantity += quantity;
    } else {
      this.items.push({ product, quantity });
    }
    this.save();
  }

  // Supprimer un produit du panier
  remove(productId: number) {
    this.items = this.items.filter(i => i.product.id !== productId);
    this.save();
  }

  // Modifier la quantité d'un produit
  updateQuantity(productId: number, quantity: number) {
    const item = this.items.find(i => i.product.id === productId);
    if (item) {
      item.quantity = quantity;
      if (item.quantity <= 0) this.remove(productId);
      this.save();
    }
  }

  // Obtenir tous les articles du panier
  getItems(): CartItem[] {
    return this.items;
  }

  // Obtenir le sous-total
  getSubtotal(): number {
    return this.items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);
  }

  // Vider le panier
  clear() {
    this.items = [];
    this.save();
  }

  // Sauvegarder dans localStorage
  private save() {
    localStorage.setItem('cart', JSON.stringify(this.items));
  }
}

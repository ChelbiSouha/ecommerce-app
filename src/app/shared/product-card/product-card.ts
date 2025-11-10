import { Component, Input } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common'; 
import { Product } from '../../core/product';
import { CartService } from '../../core/cart';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Rating } from '../rating/rating';
import { Router } from '@angular/router';
import { WishlistService } from '../../core/wishlist';

@Component({
  selector: 'app-product-card',
  imports: [CommonModule, 
    CurrencyPipe,
    MatCardModule, 
    MatButtonModule, 
    MatIconModule,
  Rating],
  templateUrl: './product-card.html',
  styleUrl: './product-card.scss',
})
export class ProductCard {
   @Input() product!: Product;

  constructor(private cartService: CartService,private router: Router,public wishlist: WishlistService) {}

  addToCart(event: MouseEvent) {
    event.stopPropagation();
    this.cartService.add(this.product, 1);
    alert(`${this.product.name} ajouté au panier !`);
  }

  goToDetails() {
    this.router.navigate(['/products', this.product.id]);
  }
  toggleFavorite(event: MouseEvent) {
    event.stopPropagation();
    this.wishlist.toggle(this.product);
  }

  isFavorite(): boolean {
    return this.wishlist.isFavorite(this.product.id);
  }

}

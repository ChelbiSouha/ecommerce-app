import { Component, OnInit } from '@angular/core';
import { WishlistService } from '../../core/wishlist';
import { Product } from '../../core/product';
import { CommonModule, CurrencyPipe, NgIf, NgFor } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ProductCard } from '../../shared/product-card/product-card';
import { Rating } from '../../shared/rating/rating';

@Component({
  selector: 'app-wishlist',
  imports: [CommonModule,
    NgIf,
    NgFor,
    CurrencyPipe,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    ProductCard,
    Rating],
  templateUrl: './wishlist.html',
  styleUrl: './wishlist.scss',
})
export class WishlistComponent implements OnInit {
  wishlist: Product[] = [];

  constructor(private wishlistService: WishlistService) {}

  ngOnInit(): void {
    this.wishlistService.wishlist$.subscribe(items => {
      this.wishlist = items;
    });
  }

  remove(productId: number) {
    this.wishlistService.remove(productId);
  }
}

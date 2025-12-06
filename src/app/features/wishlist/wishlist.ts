import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { Product, ProductService } from '../../core/product';
import { WishlistService } from '../../core/wishlist';
import { AuthService } from '../../core/auth';
import { Rating } from '../../shared/rating/rating';
import { CategoryService } from '../../core/category';

@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [CommonModule, RouterModule, MatButtonModule, MatIconModule , MatCardModule, Rating],
  templateUrl: './wishlist.html',
  styleUrls: ['./wishlist.scss']
})
export class Wishlist implements OnInit {
  wishlist: Product[] = [];
  loading = true;
  categoryMap: Record<string, string> = {};

  constructor(
    private wishlistService: WishlistService,
    private productService: ProductService,
    private auth: AuthService,
    private categoryService: CategoryService
  ) {}

  ngOnInit(): void {
    this.loadWishlist();

    this.categoryService.getAll().subscribe(categories => {
      this.categoryMap = categories.reduce((acc, c) => {
        acc[c.id] = c.name;
        return acc;
      }, {} as Record<string, string>);
    });

    this.wishlistService.wishlist$.subscribe(list => {
      this.wishlist = list;
    });
  }

  categoryName(categoryId: string): string {
    return this.categoryMap[categoryId] || 'Inconnue';
  }

  private loadWishlist(): void {
    this.loading = true;
    const user = this.auth.getCurrentUser();
    if (!user) {
      this.wishlist = [];
      this.loading = false;
      return;
    }

    this.wishlistService.loadWishlist();
    this.loading = false;
  }

  removeFromWishlist(productId: string): void {
    this.wishlistService.remove(productId);
  }

  toggleWishlist(product: Product): void {
    this.wishlistService.toggle(product);
  }

  isFavorite(productId: string): boolean {
    return this.wishlistService.isFavorite(productId);
  }
}

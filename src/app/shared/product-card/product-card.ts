import { Component, Input, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common'; 
import { Product } from '../../core/product';
import { CartService } from '../../core/cart';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Rating } from '../rating/rating';
import { Router } from '@angular/router';
import { WishlistService } from '../../core/wishlist';
import { AuthService, LoggedUser } from '../../core/auth';
import { CategoryService, Category } from '../../core/category';

@Component({
  selector: 'app-product-card',
  imports: [
    CommonModule, 
    CurrencyPipe,
    MatCardModule, 
    MatButtonModule, 
    MatIconModule,
    Rating
  ],
  templateUrl: './product-card.html',
  styleUrls: ['./product-card.scss'],
})
export class ProductCard implements OnInit {
  @Input() product!: Product;
  currentUser: LoggedUser | null = null;
  categoryMap: Record<string, string> = {}; // categoryId -> name

  constructor(
    private cartService: CartService,
    private router: Router,
    public wishlist: WishlistService,
    private auth: AuthService,
    private categoryService: CategoryService
  ) {}

  ngOnInit(): void {
    // Load category names
    this.categoryService.getAll().subscribe(categories => {
      this.categoryMap = categories.reduce((acc, c) => {
        acc[c.id] = c.name;
        return acc;
      }, {} as Record<string, string>);
    });

    this.auth.currentUser$.subscribe(user => {
      this.currentUser = user;
      if (user) this.wishlist.loadWishlist();
    });
  }

  get categoryName(): string {
    return this.categoryMap[this.product.categoryId] || 'Inconnue';
  }

  addToCart(event: MouseEvent) {
    event.stopPropagation();
    if (!this.currentUser) {
      alert('Veuillez vous connecter pour ajouter au panier.');
      this.router.navigate(['/login']);
      return;
    }

    this.cartService.addToCart(this.product, 1, this.currentUser.id, this.currentUser.token)
      .subscribe({
        next: () => alert(`${this.product.name} ajouté au panier !`),
        error: err => alert('Erreur: ' + err.message)
      });
  }

  goToDetails() {
    this.router.navigate(['/products', this.product.id]);
  }

  toggleFavorite(event: MouseEvent) {
    event.stopPropagation();
    if (!this.currentUser) {
      alert('Veuillez vous connecter pour ajouter aux favoris.');
      this.router.navigate(['/login']);
      return;
    }
    this.wishlist.toggle(this.product);
  }

  isFavorite(): boolean {
    return this.wishlist.isFavorite(this.product.id);
  }
}

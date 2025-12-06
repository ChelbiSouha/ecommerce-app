import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ProductService, Product } from '../../../core/product';
import { CartService } from '../../../core/cart';
import { AuthService } from '../../../core/auth';
import { CategoryService } from '../../../core/category';

// Angular Material Modules
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';

import { ProductCard } from '../../../shared/product-card/product-card';

interface Category {
  id: string;
  name: string;
}

@Component({
  selector: 'app-product-list',
  standalone: true,  // important!
  imports: [
    CommonModule,
    ProductCard,
    MatFormFieldModule,
    MatSelectModule,
    MatOptionModule,
    MatIconModule,
    MatPaginatorModule,
    MatButtonModule,
  ],
  templateUrl: './product-list.html',
  styleUrls: ['./product-list.scss'],
})
export class ProductList implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];

 categories: Category[] = [];
  selectedCategory = '';

  priceRange = { min: 0, max: 1000 };
  ratingFilter = 0;

  page = 1;
  pageSize = 8;
  totalPages = 1;

  sortOption = '';

  constructor(
    private ps: ProductService,
    private cartService: CartService,
    private cs: CategoryService,
    private auth: AuthService,
    private route: ActivatedRoute
  ) {}

 ngOnInit(): void {
  this.cs.getAll().subscribe(cats => {
    this.categories = cats;
  });

  this.loadProducts();
}


  loadProducts() {
    this.ps.getProducts().subscribe(products => {
      this.products = products;
      this.filteredProducts = [...products];
      this.totalPages = Math.ceil(this.filteredProducts.length / this.pageSize);

      this.route.queryParams.subscribe(params => {
        const q = params['q'] || '';
        if (q) {
          this.filteredProducts = this.products.filter(p =>
            p.name.toLowerCase().includes(q.toLowerCase())
          );
        } else {
          this.filteredProducts = [...this.products];
        }
        this.totalPages = Math.ceil(this.filteredProducts.length / this.pageSize);
        this.page = 1;
      });
    });
  }

  applyFilters() {
    this.filteredProducts = this.products.filter(p => {
      const categoryMatch = this.selectedCategory ? p.categoryId === this.selectedCategory : true;
      const priceMatch = p.price >= this.priceRange.min && p.price <= this.priceRange.max;
      const ratingMatch = p.rating >= this.ratingFilter;
      return categoryMatch && priceMatch && ratingMatch;
    });
    this.applySort();
    this.totalPages = Math.ceil(this.filteredProducts.length / this.pageSize);
    this.page = 1;
  }

  applySort() {
    switch (this.sortOption) {
      case 'priceAsc':
        this.filteredProducts.sort((a, b) => a.price - b.price);
        break;
      case 'priceDesc':
        this.filteredProducts.sort((a, b) => b.price - a.price);
        break;
      case 'popularity':
        this.filteredProducts.sort((a, b) => b.ratingsCount - a.ratingsCount);
        break;
      case 'newest':
        this.filteredProducts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
    }
  }

  get paginatedProducts(): Product[] {
    const start = (this.page - 1) * this.pageSize;
    return this.filteredProducts.slice(start, start + this.pageSize);
  }

  nextPage() {
    if (this.page < this.totalPages) this.page++;
  }

  prevPage() {
    if (this.page > 1) this.page--;
  }

  addToCart(product: Product) {
    const user = this.auth.getCurrentUser();
    const token = user?.token;
    if (!user || !token) {
      alert('Veuillez vous connecter pour ajouter au panier.');
      return;
    }

    this.cartService.addToCart(product, 1, user.id, token).subscribe({
      next: () => alert(`${product.name} ajouté au panier !`),
      error: () => alert('Erreur lors de l\'ajout au panier.')
    });
  }

  getCategoryName(categoryId: string): string {
    const cat = this.categories.find(c => c.id === categoryId);
    return cat ? cat.name : categoryId;
  }
}

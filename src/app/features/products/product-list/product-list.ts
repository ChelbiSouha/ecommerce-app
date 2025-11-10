import { Component, OnInit } from '@angular/core';
import { ProductService, Product } from '../../../core/product';
import { CartService } from '../../../core/cart';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { CommonModule } from '@angular/common';
import { ProductCard } from '../../../shared/product-card/product-card';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-product-list',
  imports: [ CommonModule,
    ProductCard,
    MatFormFieldModule,   
    MatSelectModule,     
    MatOptionModule,      
    MatPaginatorModule,
  MatIconModule],
  templateUrl: './product-list.html',
  styleUrl: './product-list.scss',
})
export class ProductList implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  
  // Filtres
  categories: string[] = [];
  selectedCategory = '';
  priceRange = { min: 0, max: 1000 };
  ratingFilter = 0;
  
  // Pagination
  page = 1;
  pageSize = 8;
  totalPages = 1;

  sortOption = '';

  constructor(private ps: ProductService, private cartService: CartService,private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.ps.getProducts().subscribe(res => {
      this.products = res;
      this.filteredProducts = res;
      this.categories = [...new Set(res.map(p => p.category))];
      this.totalPages = Math.ceil(this.filteredProducts.length / this.pageSize);
      this.route.queryParams.subscribe(params => {
      const q = params['q'] || '';
      if (q) {
        this.filteredProducts = this.products.filter(p =>
          p.name.toLowerCase().includes(q.toLowerCase())
        );
        this.totalPages = Math.ceil(this.filteredProducts.length / this.pageSize);
        this.page = 1;
      } else {
        this.filteredProducts = this.products;
      }
       });
    });
  }

  // Appliquer filtres
  applyFilters() {
    this.filteredProducts = this.products.filter(p => {
      const categoryMatch = this.selectedCategory ? p.category === this.selectedCategory : true;
      const priceMatch = p.price >= this.priceRange.min && p.price <= this.priceRange.max;
      const ratingMatch = p.rating >= this.ratingFilter;
      return categoryMatch && priceMatch && ratingMatch;
    });
    this.applySort();
    this.totalPages = Math.ceil(this.filteredProducts.length / this.pageSize);
    this.page = 1;
  }

  // Appliquer tri
  applySort() {
    switch (this.sortOption) {
      case 'priceAsc':
        this.filteredProducts.sort((a,b) => a.price - b.price);
        break;
      case 'priceDesc':
        this.filteredProducts.sort((a,b) => b.price - a.price);
        break;
      case 'popularity':
        this.filteredProducts.sort((a,b) => b.popularity - a.popularity);
        break;
      case 'newest':
        this.filteredProducts.sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      default: break;
    }
  }

  // Pagination
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
    this.cartService.add(product, 1);
    alert(`${product.name} ajouté au panier !`);
  }


}

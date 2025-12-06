import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProductService, Product } from '../../../core/product';
import { ProductCard } from '../../../shared/product-card/product-card';
import { catchError, of } from 'rxjs';

@Component({
  selector: 'app-home',
  imports: [CommonModule, RouterModule, ProductCard],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home implements OnInit {
  products: Product[] = [];
  currentSlide = 0;
  loading = false;
  error = '';

  banners = [
    { image: 'assets/images/banner1.jpg', title: 'Découvrez nos nouveaux smartphones 📱' },
    { image: 'assets/images/banner2.jpg', title: 'Tablettes en promo jusqu’à -40% 💻' },
    { image: 'assets/images/banner3.jpg', title: 'Livraison gratuite sur les enceintes 🔊' },
  ];

  categories = [
    { name: 'Smartphones', icon: '📱', image: 'assets/images/phone1.jpg' },
    { name: 'Tablettes', icon: '💻', image: 'assets/images/laptop1.jpg' },
    { name: 'Enceintes', icon: '🔊', image: 'assets/images/speaker1.jpg' },
    { name: 'Imprimantes', icon: '🖨️', image: 'assets/images/printer1.jpg' },
    { name: 'Accessoires', icon: '🎧', image: 'assets/images/mouse1.jpg' }
  ];

  constructor(private ps: ProductService) {}

  ngOnInit() {
    this.loadFeaturedProducts();

    // Auto slide carousel
    setInterval(() => {
      this.currentSlide = (this.currentSlide + 1) % this.banners.length;
    }, 4000);
  }

  loadFeaturedProducts() {
  this.loading = true;
  this.error = '';

  this.ps.getFeatured(0, 8)
    .pipe(
      catchError(err => {
        this.error = 'Impossible de charger les produits. Veuillez réessayer plus tard.';
        this.loading = false;
        return of({ content: [] } as any); // default Page<Product>
      })
    )
    .subscribe(res => {
      this.products = res.content; // ⚡ Use .content because backend returns Page<Product>
      this.loading = false;
    });
}

}

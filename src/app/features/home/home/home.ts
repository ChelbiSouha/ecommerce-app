import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProductService, Product } from '../../../core/product';
import { ProductCard } from '../../../shared/product-card/product-card';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, ProductCard],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home implements OnInit {
  products: Product[] = [];
  currentSlide = 0;

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
    // Load featured products
    this.ps.getProducts().subscribe(res => (this.products = res.slice(0, 8)));

    // Auto slide carousel
    setInterval(() => {
      this.currentSlide = (this.currentSlide + 1) % this.banners.length;
    }, 4000);
  }
}

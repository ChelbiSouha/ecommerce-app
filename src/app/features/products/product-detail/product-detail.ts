import { Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ProductService, Product } from '../../../core/product';
import { CartService } from '../../../core/cart';
import { ProductCard } from '../../../shared/product-card/product-card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-product-detail',
  imports: [
    CommonModule,
    FormsModule,
    ProductCard,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule
  ],
  templateUrl: './product-detail.html',
  styleUrl: './product-detail.scss',
})
export class ProductDetail {
  @ViewChild('mainImage') mainImage!: ElementRef<HTMLImageElement>;

  product!: Product;
  quantity = 1;
  selectedImage!: string;
  similarProducts: Product[] = [];

  constructor(
    private route: ActivatedRoute,
    private ps: ProductService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.ps.getProductById(id).subscribe(p => {
      if (p) {
        this.product = p;
        this.selectedImage = p.images[0];
        this.loadSimilarProducts();
      } else alert('Produit introuvable');
    });
  }

  loadSimilarProducts() {
    this.ps.getProducts().subscribe(products => {
      this.similarProducts = products
        .filter(p => p.category === this.product.category && p.id !== this.product.id)
        .slice(0, 4);
    });
  }

  selectImage(img: string) {
    this.selectedImage = img;
  }

  addToCart() {
    this.cartService.add(this.product, this.quantity);
    this.flyToCart();
  }

  private flyToCart() {
    const image = this.mainImage.nativeElement;
    const cart = document.querySelector('#cart-icon');
    if (!cart) return;

    const rect = image.getBoundingClientRect();
    const cartRect = cart.getBoundingClientRect();

    // Create cloned image
    const clone = image.cloneNode(true) as HTMLElement;
    clone.style.position = 'fixed';
    clone.style.left = rect.left + 'px';
    clone.style.top = rect.top + 'px';
    clone.style.width = rect.width + 'px';
    clone.style.height = rect.height + 'px';
    clone.style.transition =
      'all 1s cubic-bezier(0.55, 0.06, 0.68, 0.19), opacity 1s ease';
    clone.style.zIndex = '2000';
    document.body.appendChild(clone);

    // Trigger reflow so transition starts
    void clone.offsetWidth;

    clone.style.left = cartRect.left + 'px';
    clone.style.top = cartRect.top + 'px';
    clone.style.width = '40px';
    clone.style.height = '40px';
    clone.style.opacity = '0.2';
    clone.style.borderRadius = '50%';
    clone.style.transform = 'rotate(360deg) scale(0.2)';

    clone.addEventListener('transitionend', () => {
      clone.remove();
      cart.classList.add('pop');
      setTimeout(() => cart.classList.remove('pop'), 400);
    });
  }
}

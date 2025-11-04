import { Component, OnInit } from '@angular/core';
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
  imports: [ CommonModule,        
    CurrencyPipe,       
    FormsModule,         
    ProductCard, 
    MatIconModule,       
    MatButtonModule,     
    MatInputModule,      
    MatFormFieldModule],
  templateUrl: './product-detail.html',
  styleUrl: './product-detail.scss',
})
export class ProductDetail {
  product!: Product;
  quantity: number = 1;
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
      if (p) {  // <- vérification obligatoire
    this.product = p;
    this.selectedImage = p.images[0];
    this.loadSimilarProducts();
  } else {
    alert('Produit introuvable');
  }
    });
  }

  loadSimilarProducts() {
    this.ps.getProducts().subscribe(products => {
      this.similarProducts = products
        .filter(p => p.category === this.product.category && p.id !== this.product.id)
        .slice(0, 4); // 4 produits similaires
    });
  }

  selectImage(img: string) {
    this.selectedImage = img;
  }

  addToCart() {
    this.cartService.add(this.product, this.quantity);
    alert(`${this.product.name} ajouté au panier !`);
  }

}

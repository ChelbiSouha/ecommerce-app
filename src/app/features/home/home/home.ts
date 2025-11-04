import { Component, OnInit } from '@angular/core';
import { ProductService, Product } from '../../../core/product';
import { ProductCard } from '../../../shared/product-card/product-card';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';



@Component({
  selector: 'app-home',
  imports: [CommonModule, RouterModule, ProductCard],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  products: Product[] = [];
  constructor(private ps: ProductService) {}

  ngOnInit() {
    this.ps.getProducts().subscribe(res => this.products = res.slice(0,8));
  }

}

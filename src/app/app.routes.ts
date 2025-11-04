import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },

  { path: 'home', loadComponent: () => import('./features/home/home/home').then(m => m.Home) },

  { path: 'products', loadComponent: () => import('./features/products/product-list/product-list').then(m => m.ProductList) },
  { path: 'products/:id', loadComponent: () => import('./features/products/product-detail/product-detail').then(m => m.ProductDetail) },

  { path: 'cart', loadComponent: () => import('./features/cart/cart/cart').then(m => m.Cart) },

  { path: 'auth/login', loadComponent: () => import('./features/auth/login/login').then(m => m.Login) },
  { path: 'auth/signup', loadComponent: () => import('./features/auth/signup/signup').then(m => m.Signup) },

  { path: '**', redirectTo: 'home' }
];

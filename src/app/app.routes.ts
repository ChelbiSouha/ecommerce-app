import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },

  { path: 'home', loadComponent: () => import('./features/home/home/home').then(m => m.Home) },

  { path: 'products', loadComponent: () => import('./features/products/product-list/product-list').then(m => m.ProductList) },
  { path: 'products/:id', loadComponent: () => import('./features/products/product-detail/product-detail').then(m => m.ProductDetail) },

  { path: 'cart', loadComponent: () => import('./features/cart/cart/cart').then(m => m.Cart) },

  { path: 'auth/login', loadComponent: () => import('./features/auth/login/login').then(m => m.Login) },
  { path: 'auth/signup', loadComponent: () => import('./features/auth/signup/signup').then(m => m.Signup) },
  { path: 'profile', loadComponent: () => import('./features/profile/profile').then(m => m.Profile) },
  { path: 'profile/orders', loadComponent: () => import('./features/orders/orders').then(m => m.Orders)  },
  { path: 'wishlist', loadComponent: () => import('./features/wishlist/wishlist').then(m => m.WishlistComponent)  },

  { path: '**', redirectTo: 'home' }
];

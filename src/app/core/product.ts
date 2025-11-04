import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';

export interface Product {
  id:number; name:string; price:number; category:string;
  images:string[]; rating:number; stock:number;
  description:string; popularity:number; createdAt:string;
}

@Injectable({providedIn:'root'})
export class ProductService {
  private url = 'assets/mock/products.json';
  private cache: Product[] | null = null;

  constructor(private http: HttpClient){}

  getProducts(): Observable<Product[]> {
    if (this.cache) return of(this.cache).pipe(delay(300));
    return this.http.get<Product[]>(this.url).pipe(
      delay(500),
      map(list => { this.cache = list; return list; })
    );
  }

  getProductById(id:number): Observable<Product | undefined> {
    return this.getProducts().pipe(map(list => list.find(p => p.id === id)));
  }
}

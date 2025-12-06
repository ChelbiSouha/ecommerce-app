import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';


export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  images: string[];
  categoryId: string;
  rating: number;
  ratingsCount: number;
  specs: { [key: string]: string };
  isFeatured: boolean;
  createdAt: string;
}
export interface Page<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}


@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private baseUrl = 'http://localhost:8080/api/products'; // backend API URL

  constructor(private http: HttpClient) {}

  // Get all products (no pagination)
  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.baseUrl);
  }

  // Get product by ID
  getProductById(id: string): Observable<Product> {
    return this.http.get<Product>(`${this.baseUrl}/${id}`);
  }

  // Get products by category (with pagination)
getProductsByCategory(
  categoryId: string,
  page = 0,
  size = 10,
  sortBy = 'name',
  direction = 'asc'
): Observable<Product[]> {
  const params = new HttpParams()
    .set('page', page)
    .set('size', size)
    .set('sortBy', sortBy)
    .set('direction', direction);

  return this.http.get<Page<Product>>(`${this.baseUrl}/category/${categoryId}`, { params })
    .pipe(
      map((res: Page<Product>) => res.content)  // type annotation fixes TS7006
    );
}



  // Search products by keyword (frontend Header uses queryParams)
searchProducts(keyword: string, page = 0, size = 10, sortBy = 'name', direction = 'asc'): Observable<Product[]> {
  const params = new HttpParams()
    .set('q', keyword)
    .set('page', page)
    .set('size', size)
    .set('sortBy', sortBy)
    .set('direction', direction);
  return this.http.get<Product[]>(`${this.baseUrl}`, { params });
}

  // Get featured products (pagination)
  getFeatured(page = 0, size = 5): Observable<Page<Product>> {
  const params = new HttpParams().set('page', page).set('size', size);
  return this.http.get<Page<Product>>(`${this.baseUrl}/featured`, { params });
}


  // Get new arrivals (pagination)
  getNewArrivals(page = 0, size = 10): Observable<any> {
    const params = new HttpParams().set('page', page).set('size', size);
    return this.http.get(`${this.baseUrl}/new`, { params });
  }

  // Filter by price (pagination)
  filterByPrice(min: number, max: number, page = 0, size = 10): Observable<any> {
    const params = new HttpParams()
      .set('min', min)
      .set('max', max)
      .set('page', page)
      .set('size', size);
    return this.http.get(`${this.baseUrl}/filter/price`, { params });
  }

  // Filter by rating (pagination)
  filterByRating(minRating: number, page = 0, size = 10): Observable<any> {
    const params = new HttpParams()
      .set('minRating', minRating)
      .set('page', page)
      .set('size', size);
    return this.http.get(`${this.baseUrl}/filter/rating`, { params });
  }
  

  // Admin operations (requires JWT token in headers)
  createProduct(product: Product, token: string): Observable<Product> {
    return this.http.post<Product>(this.baseUrl, product, { headers: { Authorization: `Bearer ${token}` } });
  }

  updateProduct(id: string, product: Product, token: string): Observable<Product> {
    return this.http.put<Product>(`${this.baseUrl}/${id}`, product, { headers: { Authorization: `Bearer ${token}` } });
  }

  deleteProduct(id: string, token: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`, { headers: { Authorization: `Bearer ${token}` } });
  }
}

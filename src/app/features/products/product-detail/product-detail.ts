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
import { ReviewService, Review } from '../../../core/review';
import { AuthService, LoggedUser } from '../../../core/auth';
import { Rating } from '../../../shared/rating/rating';

@Component({
  selector: 'app-product-detail',
  imports: [
    CommonModule,
    FormsModule,
    ProductCard,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    Rating
  ],
  templateUrl: './product-detail.html',
  styleUrls: ['./product-detail.scss'],
})
export class ProductDetail {

  @ViewChild('mainImage') mainImage!: ElementRef<HTMLImageElement>;

  product!: Product;
  quantity = 1;
  selectedImage!: string;
  similarProducts: Product[] = [];

  reviews: Review[] = [];
newReview: { rating: number; comment: string } = { rating: 0, comment: '' };

  editingReviewId: string | null = null;
  currentUser: LoggedUser | null = null;

  constructor(
    private route: ActivatedRoute,
    private ps: ProductService,
    private cartService: CartService,
    private reviewService: ReviewService,
    private auth: AuthService
  ) {
    this.auth.currentUser$.subscribe(user => this.currentUser = user);
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.ps.getProductById(id).subscribe(p => {
      if (p) {
        this.product = p;
        this.selectedImage = p.images[0];
        this.loadSimilarProducts();
        this.loadReviews();
      } else alert('Produit introuvable');
    });
  }

  loadSimilarProducts() {
    this.ps.getProducts().subscribe(products => {
      this.similarProducts = products
        .filter(p => p.categoryId === this.product.categoryId && p.id !== this.product.id)
        .slice(0, 4);
    });
  }

  selectImage(img: string) {
    this.selectedImage = img;
  }

  /** -------- CART --------- */

 addToCart() {
  const user = this.auth.getCurrentUser();
  if (!user?.token) return alert('Veuillez vous connecter.');

  // Correct argument order: (product, quantity, userId, token)
  this.cartService.addToCart(this.product, this.quantity, user.id, user.token)
    .subscribe({
      next: () => this.flyToCart(),
      error: () => alert('Erreur lors de l\'ajout au panier.')
    });
}


  private flyToCart() {
    const image = this.mainImage.nativeElement;
    const cart = document.querySelector('#cart-icon');
    if (!cart) return;

    const rect = image.getBoundingClientRect();
    const cartRect = cart.getBoundingClientRect();

    const clone = image.cloneNode(true) as HTMLElement;
    clone.style.position = 'fixed';
    clone.style.left = rect.left + 'px';
    clone.style.top = rect.top + 'px';
    clone.style.width = rect.width + 'px';
    clone.style.height = rect.height + 'px';
    clone.style.transition = 'all 1s ease';
    clone.style.zIndex = '2000';
    document.body.appendChild(clone);

    void clone.offsetWidth;

    clone.style.left = cartRect.left + 'px';
    clone.style.top = cartRect.top + 'px';
    clone.style.width = '40px';
    clone.style.height = '40px';
    clone.style.opacity = '0.2';
    clone.style.borderRadius = '50%';
    clone.style.transform = 'scale(0.2)';

    clone.addEventListener('transitionend', () => clone.remove());
  }

  /** -------- REVIEWS --------- */
loadReviews() {
  if (!this.currentUser) return;

  this.reviewService.getReviews(this.product.id, this.currentUser.token)
    .subscribe({
      next: res => {
        this.reviews = res.map(r => ({
          ...r,
          createdAt: r.createdAt ? new Date(r.createdAt) : new Date()
        }));
      },
      error: err => {
        console.error('Error loading reviews', err);
      }
    });
}




  submitReview() {
  if (!this.currentUser) return alert('Connectez-vous pour commenter.');
  if (!this.newReview.rating) return alert('Veuillez choisir une note.');

  const review: Review = {
    productId: this.product.id,
    userId: this.currentUser.id,
    userName: this.currentUser.email,
    rating: this.newReview.rating,
    comment: this.newReview.comment
  };

  this.reviewService.addReview(review, this.currentUser.token)
    .subscribe(r => {
      this.reviews.push(r);
      this.newReview = { rating: 0, comment: '' };
      this.ps.getProductById(this.product.id).subscribe(p => this.product = p);
    });
}


  startEdit(r: Review) {
    this.editingReviewId = r.id!;
    this.newReview = { rating: r.rating, comment: r.comment };
  }

  saveEdit(reviewId: string) {
    if (!this.currentUser) return;
    if (!this.newReview.rating) return alert('Note invalide.');

    const updated: Review = {
      id: reviewId,
      productId: this.product.id,
      userId: this.currentUser!.id,
      rating: this.newReview.rating!,
      comment: this.newReview.comment!
    };

    this.reviewService.updateReview(reviewId, updated, this.currentUser.token)
      .subscribe(saved => {
        const idx = this.reviews.findIndex(r => r.id === saved.id);
        this.reviews[idx] = saved;
        this.editingReviewId = null;
        this.newReview = { rating: 0, comment: '' };
      });
  }

  cancelEdit() {
    this.editingReviewId = null;
    this.newReview = { rating: 0, comment: '' };
  }

  deleteReview(id: string) {
    if (!this.currentUser) return;

    this.reviewService.deleteReview(id, this.currentUser.token)
      .subscribe(() => this.reviews = this.reviews.filter(r => r.id !== id));
  }
}

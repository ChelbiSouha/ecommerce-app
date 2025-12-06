import { RouterModule } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { CartService, CartItem } from '../../core/cart';
import { OrderService } from '../../core/order';
import { AuthService, LoggedUser } from '../../core/auth';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    CurrencyPipe,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule
  ],
  templateUrl: './payment.html',
  styleUrls: ['./payment.scss']
})
export class Payment implements OnInit {

  currentUser: LoggedUser | null = null;
  cartItems: CartItem[] = [];
  shippingFee: number = 5.99;

  // Fake payment form fields
  cardNumber: string = '';
  cardName: string = '';
  expiryDate: string = '';
  cvv: string = '';

  loading: boolean = false;

  constructor(
    private cartService: CartService,
    private orderService: OrderService,
    private auth: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.auth.currentUser$.subscribe(user => {
      this.currentUser = user;
      this.loadCart();
    });
  }

  private loadCart() {
    if (!this.currentUser) return;

    this.cartService.getCart(this.currentUser.id, this.currentUser.token).subscribe(cart => {
      this.cartItems = cart.items;
    });
  }

  get subtotal(): number {
    return this.cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }

  get total(): number {
    return this.subtotal + (this.cartItems.length ? this.shippingFee : 0);
  }

  confirmPayment() {
    if (!this.cardNumber || !this.cardName || !this.expiryDate || !this.cvv) {
      alert('Veuillez remplir tous les champs de paiement.');
      return;
    }

    if (!this.currentUser) {
      alert('Veuillez vous connecter pour passer la commande.');
      return;
    }

    this.loading = true;

    const orderData = {
      userId: this.currentUser.id,
      items: this.cartItems.map(item => ({
        productId: item.productId,
        productName: item.productName,
        price: item.price,
        quantity: item.quantity
      })),
      total: this.total
    };

    this.orderService.createOrder(orderData, this.currentUser.token).subscribe({
      next: order => {
        // Clear cart
        this.cartService.clearCart(this.currentUser!.id).subscribe(() => {
          alert(`✅ Paiement réussi ! Votre commande #${order.id} a été créée.`);
          this.router.navigate(['/orders']);
        });
      },
      error: err => {
        console.error(err);
        alert('❌ Une erreur est survenue lors de la création de la commande.');
        this.loading = false;
      }
    });
  }
}

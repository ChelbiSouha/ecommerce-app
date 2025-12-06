import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { OrderService, Order } from '../../core/order';
import { AuthService, LoggedUser } from '../../core/auth';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [
    CommonModule,
    CurrencyPipe,
    MatIconModule
  ],
  templateUrl: './orders.html',
  styleUrls: ['./orders.scss']
})
export class OrdersComponent implements OnInit {

  currentUser: LoggedUser | null = null;
  orders: any[] = []; // formatted for the HTML

  constructor(
    private orderService: OrderService,
    private auth: AuthService
  ) {}

  ngOnInit() {
    this.auth.currentUser$.subscribe(user => {
      this.currentUser = user;

      if (user) {
        this.loadOrders(user.id, user.token);
      }
    });
  }

  loadOrders(userId: string, token: string) {
    this.orderService.getOrdersForUser(userId, token).subscribe({
      next: (data: Order[]) => {
        // transform orders for your HTML
        this.orders = data.map(o => ({
          id: o.id,
          date: new Date(o.createdAt).toLocaleDateString(),
          status: o.status,
          total: o.total,
          items: o.items.map(i => ({
            name: i.productName,
            quantity: i.quantity,
            price: i.price
          }))
        }));
      },
      error: err => console.error('Error loading orders:', err)
    });
  }
}

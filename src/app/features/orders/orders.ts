import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { AuthService, User } from '../../core/auth';

interface Order {
  id: number;
  date: string;
  total: number;
  status: string;
  items: { name: string; quantity: number; price: number }[];
}

@Component({
  selector: 'app-orders',
  imports: [CommonModule, MatIconModule],
  templateUrl: './orders.html',
  styleUrls: ['./orders.scss'],
})
export class Orders implements OnInit {
  orders: Order[] = [];
  currentUser: User | null = null;

  constructor(private auth: AuthService) {}

  ngOnInit() {
    this.currentUser = this.auth.getCurrentUser();
    this.orders = [
      {
        id: 101,
        date: '2025-11-02',
        total: 1249.99,
        status: 'Delivered',
        items: [
          { name: 'iPhone 15 Pro', quantity: 1, price: 1249.99 },
        ],
      },
      {
        id: 102,
        date: '2025-10-12',
        total: 899.49,
        status: 'In Progress',
        items: [
          { name: 'Samsung Tablet', quantity: 1, price: 899.49 },
        ],
      },
    ];
  }
}

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';
import { AuthService, User  } from '../../core/auth'; 
import { MatMenuModule } from '@angular/material/menu';

@Component({
  selector: 'app-header',
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatMenuModule,
  ],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header implements OnInit {
  searchTerm = '';
  currentUser: User | null = null;
  isLoggedIn = false;
  private searchSubject = new Subject<string>();

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe((user) => {
      this.currentUser = user;
      this.isLoggedIn = !!user;
    });

    this.searchSubject
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe((term) => this.triggerSearch(term));
  }

  onInputChange(value: string) {
    this.searchSubject.next(value);
  }

  onSearch() {
    this.triggerSearch(this.searchTerm);
  }

  private triggerSearch(term: string) {
    const q = term.trim();
    this.router.navigate(['/products'], { queryParams: { q } });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/']); 
  }
}

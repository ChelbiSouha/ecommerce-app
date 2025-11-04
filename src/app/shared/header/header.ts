import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
  ],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  searchTerm = '';
  private searchSubject = new Subject<string>();

  constructor(private router: Router) {
    // Listen for live search input
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
}

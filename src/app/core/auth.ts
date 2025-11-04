import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay, tap } from 'rxjs/operators';

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  password: string; 
  address?: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  private storageKey = 'userSession';
  private usersKey = 'registeredUsers';

  constructor() {
    const storedUser = localStorage.getItem(this.storageKey);
    if (storedUser) this.currentUserSubject.next(JSON.parse(storedUser));
  }

  signup(user: User): Observable<User> {
    const users = this.getRegisteredUsers();
    user.id = users.length + 1;
    users.push(user);
    localStorage.setItem(this.usersKey, JSON.stringify(users));
    return of(user).pipe(delay(500));
  }

  login(email: string, password: string): Observable<User | null> {
    const users = this.getRegisteredUsers();
    const found = users.find(u => u.email === email && u.password === password) || null;
    return of(found).pipe(
      delay(500),
      tap(user => {
        if (user) {
          localStorage.setItem(this.storageKey, JSON.stringify(user));
          this.currentUserSubject.next(user);
        }
      })
    );
  }

  logout() {
    localStorage.removeItem(this.storageKey);
    this.currentUserSubject.next(null);
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  private getRegisteredUsers(): User[] {
    return JSON.parse(localStorage.getItem(this.usersKey) || '[]');
  }
}

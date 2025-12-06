import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { tap, map, catchError } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';

export interface LoggedUser {
  id: string;
  email: string;
  token: string;
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  address?: string;
  token?: string;
}

export interface AuthRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  address?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'http://localhost:8080/api/auth';
  private userKey = 'userSession';

  private currentUserSubject = new BehaviorSubject<LoggedUser | null>(
    JSON.parse(localStorage.getItem(this.userKey) || 'null')
  );
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    // Only load from server if there is a token
    const session = this.currentUserSubject.value;
    if (session?.token) {
      this.tryLoadUserFromServer(session.token);
    }
  }

  /** Register a new user */
  signup(body: RegisterRequest): Observable<User> {
    return this.http.post<User>(`${this.baseUrl}/register`, body);
  }

  /** Login user and store token */
  login(body: AuthRequest): Observable<LoggedUser> {
    return this.http.post<{ token: string; userId: string; email: string }>(
      `${this.baseUrl}/login`,
      body
    ).pipe(
      map(res => {
        const user: LoggedUser = { id: res.userId, email: res.email, token: res.token };
        localStorage.setItem(this.userKey, JSON.stringify(user));
        this.currentUserSubject.next(user);
        return user;
      })
    );
  }

  /** Logout user */
  logout() {
    localStorage.removeItem(this.userKey);
    this.currentUserSubject.next(null);
  }

  /** Get JWT token of logged-in user */
  getToken(): string | null {
    return this.currentUserSubject.value?.token || null;
  }

  /** Safely load user profile from backend without accidentally logging out */
  private tryLoadUserFromServer(token: string) {
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    this.http.get<User>(`${this.baseUrl}/me`, { headers })
      .pipe(
        catchError(err => {
          console.warn('Cannot load user from server, keeping local session:', err);
          return of(null); // do not logout automatically
        })
      )
      .subscribe(user => {
        if (user) {
          const session = this.currentUserSubject.value!;
        }
      });
  }

  /** Update user profile */
  updateUserProfile(user: User): Observable<User> {
    const token = this.getToken();
    if (!token) throw new Error('User not logged in');

    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this.http.put<User>(`${this.baseUrl}/update/${user.id}`, user, { headers })
      .pipe(
        tap(updated => {
          const session = this.currentUserSubject.value!;
          this.currentUserSubject.next({ ...session, email: updated.email });
          localStorage.setItem(this.userKey, JSON.stringify(this.currentUserSubject.value));
        })
      );
  }

  /** Synchronously get the current logged-in user */
  getCurrentUser(): LoggedUser | null {
    return this.currentUserSubject.value;
  }
  getFullProfile(): Observable<User> {
  const token = this.getToken();
  const headers = new HttpHeaders({
    Authorization: `Bearer ${token}`
  });

  return this.http.get<User>(`${this.baseUrl}/me`, { headers });
}

}

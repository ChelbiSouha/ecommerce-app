import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService, LoggedUser, AuthRequest } from '../../../core/auth';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    RouterModule
  ],
  templateUrl: './login.html',
  styleUrls: ['./login.scss'],
})
export class Login {
  email = '';
  password = '';
  message = '';

  constructor(private auth: AuthService, private router: Router) {}

  login() {
    this.message = '';
    const body: AuthRequest = { email: this.email, password: this.password };

    this.auth.login(body).subscribe({
      next: (user: LoggedUser) => {
        this.message = 'Connexion réussie ✅';
        setTimeout(() => this.router.navigate(['/']), 1000);
      },
      error: (err) => {
        this.message = 'Email ou mot de passe invalide ❌';
        console.error(err);
      }
    });
  }
}

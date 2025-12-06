import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService, RegisterRequest, AuthRequest, LoggedUser } from '../../../core/auth';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    RouterModule,
    MatIconModule
  ],
  templateUrl: './signup.html',
  styleUrls: ['./signup.scss'],
})
export class Signup {
  user: RegisterRequest = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    address: ''
  };
  confirmPassword = '';
  message = '';

  constructor(private auth: AuthService, private router: Router) {}

  signup() {
    this.message = '';

    if (this.user.password !== this.confirmPassword) {
      this.message = 'Les mots de passe ne correspondent pas ❌';
      return;
    }

    this.auth.signup(this.user).subscribe({
      next: () => {
        // Automatically login after registration
        const loginBody: AuthRequest = { email: this.user.email, password: this.user.password };
        this.auth.login(loginBody).subscribe({
          next: (loggedUser: LoggedUser) => {
            this.message = 'Inscription réussie et connecté ✅';
            setTimeout(() => this.router.navigate(['/']), 1000);
          },
          error: (err) => {
            this.message = 'Inscription réussie mais échec de connexion ❌';
            console.error(err);
          }
        });
      },
      error: (err) => {
        this.message = 'Erreur lors de l\'inscription ❌';
        console.error(err);
      }
    });
  }
}

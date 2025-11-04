import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService, User } from '../../../core/auth';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

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
    MatIconModule
  ],
  templateUrl: './signup.html',
  styleUrls: ['./signup.scss'],
})
export class Signup {
  user: User = { id: 0, firstName: '', lastName: '', email: '', password: '', address: '' };
  confirmPassword = '';
  message = '';

  constructor(private auth: AuthService, private router: Router) {}

  signup() {
    this.message = '';
    if (this.user.password !== this.confirmPassword) {
      this.message = 'Les mots de passe ne correspondent pas ❌';
      return;
    }

    this.auth.signup(this.user).subscribe(() => {
      this.message = 'Inscription réussie ✅';
      setTimeout(() => this.router.navigate(['/login']), 1000);
    });
  }
}

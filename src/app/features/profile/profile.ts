import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { AuthService, User } from '../../core/auth';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
  ],
  templateUrl: './profile.html',
  styleUrls: ['./profile.scss'],
})
export class Profile implements OnInit {
  user: User | null = null;
  editMode = false;
  message = '';

  constructor(private auth: AuthService) {}

  ngOnInit() {
  this.auth.currentUser$.subscribe(session => {
    if (session) this.loadFullProfile();
  });
}


  // 🔥 load full user from backend
  private loadFullProfile() {
    const token = this.auth.getToken();
    if (!token) return;

    this.auth.getFullProfile().subscribe({
      next: (u) => (this.user = u),
      error: () => console.error('Failed to load user profile')
    });
  }

  enableEdit() {
    this.editMode = true;
  }

  saveProfile() {
    if (!this.user) return;

    this.auth.updateUserProfile(this.user).subscribe({
      next: (updatedUser) => {
        this.user = updatedUser;
        this.editMode = false;
        this.message = '✅ Profil mis à jour avec succès !';
        setTimeout(() => (this.message = ''), 2000);
      },
      error: () => {
        this.message = '❌ Impossible de mettre à jour le profil.';
        setTimeout(() => (this.message = ''), 2000);
      },
    });
  }
}

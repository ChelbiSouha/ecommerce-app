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
    this.user = this.auth.getCurrentUser();
  }

  enableEdit() {
    this.editMode = true;
  }

  saveProfile() {
    if (this.user) {
      this.auth.updateUser(this.user);
      this.editMode = false;
      this.message = '✅ Profil mis à jour avec succès !';
      setTimeout(() => (this.message = ''), 2000);
    }
  }
}

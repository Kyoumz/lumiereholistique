import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../header/headerFooter/header/header.component';

@Component({
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, RouterModule, CommonModule, HeaderComponent],
  selector: 'app-reset-password',
  styleUrl: './reset-password.component.scss',
  templateUrl: './reset-password.component.html'
})
export class ResetPasswordComponent {
  password = '';
  confirm = '';
  token = '';
  message = '';
  error = '';
  messageType: 'success' | 'error' | '' = '';

  constructor(private route: ActivatedRoute, private authService: AuthService) {
    this.route.queryParams.subscribe(params => {
      this.token = params['token'] || '';
    });
  }

  submit() {
    if (this.password !== this.confirm) {
      this.message = 'Les mots de passe ne correspondent pas.';
      this.messageType = 'error';
      return;
    }

    this.authService.resetPassword(this.token, this.password).subscribe({
      next: () => {
        this.message = 'Mot de passe modifié ! Tu peux maintenant te connecter.';
        this.messageType = 'success';
      },
      error: (err) => {
        this.message = err.error?.error || 'Une erreur est survenue.';
        this.messageType = 'error';
      }
    });
  }
}

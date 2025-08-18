import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service'; // Vérifie le chemin
import { HeaderComponent } from '../../header/headerFooter/header/header.component';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss',
  imports: [CommonModule, FormsModule, HeaderComponent]
})
export class ForgotPasswordComponent {
  email = '';
  message = '';
  messageType: 'success' | 'error' | '' = '';

  constructor(private authService: AuthService) {}

  onSubmit() {
    this.authService.forgotPassword(this.email).subscribe({
      next: (res) => {
        this.showMessage('Un lien de réinitialisation a été envoyé à votre email.', 'success');
      },
      error: (err: any) => {
        console.error(err);
        this.showMessage(err.error?.error || 'Erreur lors de la demande', 'error');
      }
    });
  }

  showMessage(msg: string, type: 'success' | 'error') {
    this.message = msg;
    this.messageType = type;
    setTimeout(() => {
      this.message = '';
      this.messageType = '';
    }, 4000);
  }
}

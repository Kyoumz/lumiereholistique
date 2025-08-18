import { AuthService } from '../../services/auth.service';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../header/headerFooter/header/header.component';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, RouterModule, CommonModule, HeaderComponent, HttpClientModule],
  styleUrl: './sign-in.component.scss'
})
export class SignInComponent {
  name = '';
  email = '';
  password = '';

  message = '';
  messageType: 'success' | 'error' | '' = '';

  constructor(private authService: AuthService, private router: Router) {}

  showMessage(msg: string, type: 'success' | 'error') {
    this.message = msg;
    this.messageType = type;
    setTimeout(() => {
      this.message = '';
      this.messageType = '';
    }, 3000);
  }

  onSubmit() {
    const data = {
      name: this.name,
      email: this.email,
      password: this.password,
      role: 'user'
    };

    this.authService.register(data).subscribe({
      next: (res) => {
        console.log('Inscription réussie', res);
        this.showMessage('Compte créé avec succès !', 'success');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error(err);
        this.showMessage(err.error?.error || 'Erreur d’inscription', 'error');
      }
    });
  }
}

import { AuthService } from '../../services/auth.service';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../header/headerFooter/header/header.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, RouterModule, CommonModule, HeaderComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
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
    this.authService.login({ email: this.email, password: this.password }).subscribe({
      next: (res) => {
        localStorage.setItem('token', res.token);
        console.log(localStorage);
        this.showMessage(`Bienvenue ${res.user.name}`, 'success');
        this.router.navigate(['/mycours']);
      },
      error: (err) => {
        console.error(err);
        this.showMessage(err.error?.error || 'Erreur de connexion', 'error');
      }
    });
  }
}

import { AuthService } from '../../services/auth.service';
import { Component } from '@angular/core';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../components/header/header.component';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule,ReactiveFormsModule, RouterModule, CommonModule, HeaderComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  email = '';
  password = '';

  constructor(private authService: AuthService) {}

  onSubmit() {
    this.authService.login({ email: this.email, password: this.password }).subscribe({
      next: (res) => {
        console.log('Connexion réussie', res);
        localStorage.setItem('token', res.token);
        alert('Bienvenue ' + res.user.name);
        // Redirection possible ici
      },
      error: (err) => {
        console.error(err);
        alert(err.error?.error || 'Erreur de connexion');
      }
    });
  }
}

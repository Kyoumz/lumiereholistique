import { AuthService } from '../../services/auth.service';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../components/header/header.component';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  standalone: true,
  imports: [FormsModule,ReactiveFormsModule, RouterModule, CommonModule, HeaderComponent,HttpClientModule],
  styleUrl: './sign-in.component.scss'
})
export class SignInComponent {
  name = '';
  email = '';
  password = '';

  constructor(private authService: AuthService) {}

  onSubmit() {
    const data = {
      name: this.name,
      email: this.email,
      password: this.password,
      role: 'user' // ou autre selon ton besoin
    };

    this.authService.register(data).subscribe({
      next: (res) => {
        console.log('Inscription réussie', res);
        alert('Compte créé !');
      },
      error: (err) => {
        console.error(err);
        alert(err.error?.error || 'Erreur d’inscription');
      }
    });
  }
}

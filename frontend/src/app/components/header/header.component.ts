import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // ✅ à ajouter

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  isLoggedIn = false;
  userName = '';

  ngOnInit(): void {
    const token = localStorage.getItem('token');

    if (token) {
      this.isLoggedIn = true;
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        this.userName = payload.name || 'Mes Cours';
      } catch (e) {
        console.error('Token invalide', e);
      }
    }
  }
  
  logout() {
    localStorage.removeItem('token');
    window.location.href = '/login'; 
  }
  
}

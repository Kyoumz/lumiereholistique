import { CommonModule } from '@angular/common';
import { Component, ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  isLoggedIn = false;
  userName = '';

  constructor(private cdr: ChangeDetectorRef) {}


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
    this.cdr.detectChanges();

  }
  
  logout() {
    localStorage.removeItem('token');
    window.location.href = '/login'; 
  }
  
}

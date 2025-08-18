import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(): boolean {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    console.log(localStorage);


    if (token && userData) {
      const user = JSON.parse(userData);

      if (user.role === 'admin') {
        return true;
      }
    }

    // Redirection vers une page d'erreur ou login
    this.router.navigate(['/login']); // ou '/login'
    console.log(userData);
    return false;
  }
}

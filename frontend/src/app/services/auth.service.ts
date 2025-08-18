import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../environement'; 

interface RegisterData {
  name: string;
  email: string;
  password: string;
  role: string;
}

interface LoginData {
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private API_URL = environment.apiUrl;

  constructor(private http: HttpClient) {}

  register(data: RegisterData): Observable<any> {
    return this.http.post(`${this.API_URL}/api/register`, data);
  }

  login(data: LoginData): Observable<any> {
    return this.http.post<any>(`${this.API_URL}/api/login`, data).pipe(
      tap((response) => {
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
      })
    );
  }

  forgotPassword(email: string): Observable<any> {
    return this.http.post(`${this.API_URL}/api/forgot-password`, { email });
  }
  
  resetPassword(token: string, password: string): Observable<any> {
    return this.http.post(`${this.API_URL}/api/reset-password`, { token, password });
  }
  
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class EmailService {
  private apiUrl = 'http://localhost:5000/api/contact'; 

  constructor(private http: HttpClient) {}

  sendContactMessage(formData: any) {
    return this.http.post(this.apiUrl, formData);
  }
}

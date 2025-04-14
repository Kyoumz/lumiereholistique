import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FormationsService {
  private apiUrl = 'http://localhost:5000/api/formations';

  constructor(private http: HttpClient) {}

  getformations(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

    getFormationsById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  addFormation(formation: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, formation);
  }
  
}

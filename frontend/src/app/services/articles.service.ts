import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ArticlesService {
  private apiUrl = 'http://lumiereholistique_backend_1:5000/api/articles';

  constructor(private http: HttpClient) {}

  getformations(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

    getFormationsById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }
}

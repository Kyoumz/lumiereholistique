import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PagesService {
  private API_URL = 'http://localhost:5000/api';

  constructor(private http: HttpClient) {}



  getMyFormations(): Observable<any[]> {
    const token = localStorage.getItem('token');
    // console.log(localStorage)
    return this.http.get<any[]>(`${this.API_URL}/my-formations`, {
      headers: {
        Authorization: `${token}`
      }
    });
  }
  
  // Videos & Podcasts
  getVideosPodcasts(): Observable<any[]> {
    return this.http.get<any[]>(`${this.API_URL}/videos-podcasts`);
  }

  getVideosPodcastsById(id: string): Observable<any> {
    return this.http.get<any>(`${this.API_URL}/videos-podcasts/${id}`);
  }

  addVideosPodcasts(data: any): Observable<any> {
    return this.http.post<any>(`${this.API_URL}/videos-podcasts`, data);
  }

  // Formations
  getFormations(): Observable<any[]> {
    return this.http.get<any[]>(`${this.API_URL}/formations`);
  }

  getFormationsById(id: number): Observable<any> {
    return this.http.get<any>(`${this.API_URL}/formations/${id}`);
  }

  addFormation(data: any): Observable<any> {
    return this.http.post<any>(`${this.API_URL}/formations`, data);
  }

  // Directories
  getDirectories(): Observable<any[]> {
    return this.http.get<any[]>(`${this.API_URL}/directories`);
  }

  addDirectories(data: any): Observable<any> {
    return this.http.post<any>(`${this.API_URL}/directories`, data);
  }

  // Blog / Articles
  getArticles(): Observable<any[]> {
    return this.http.get<any[]>(`${this.API_URL}/articles`);
  }

  getArticleById(id: string): Observable<any> {
    return this.http.get<any>(`${this.API_URL}/articles/${id}`);
  }

  addArticle(data: any): Observable<any> {
    return this.http.post<any>(`${this.API_URL}/articles`, data);
  }

  // Appointments
  getAppointments(): Observable<any[]> {
    return this.http.get<any[]>(`${this.API_URL}/appointments`);
  }

  addAppointment(data: any): Observable<any> {
    return this.http.post<any>(`${this.API_URL}/appointments`, data);
  }
}

  
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environement'; // Assure-toi que le chemin est correct

@Injectable({
  providedIn: 'root'
})
export class PagesService {
  // private API_URL = 'http://localhost:5000/api';
  private API_URL = environment.apiUrl;

  constructor(private http: HttpClient) {}


  getMyFormations(): Observable<any[]> {
    const token = localStorage.getItem('token');
    // console.log(localStorage)
    return this.http.get<any[]>(`${this.API_URL}/api/my-formations`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }
  getFormationWithChapters(id: number): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get<any>(`${this.API_URL}/api/my-formations/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  addFormationToUser(formationId: number): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.post(`${this.API_URL}/api/my-formations/${formationId}`, {}, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  //Users
  getUsers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.API_URL}/api/users`);
  }
  
  // Videos & Podcasts
  getVideosPodcasts(): Observable<any[]> {
    return this.http.get<any[]>(`${this.API_URL}/api/videos-podcasts`);
  }

  getVideosPodcastsById(id: string): Observable<any> {
    return this.http.get<any>(`${this.API_URL}/api/videos-podcasts/${id}`);
  }

  addVideosPodcasts(data: any): Observable<any> {
    return this.http.post<any>(`${this.API_URL}/api/videos-podcasts`, data);
  }

  // Formations
  getFormations(): Observable<any[]> {
    return this.http.get<any[]>(`${this.API_URL}/api/formations`);
  }

  getFormationsById(id: number): Observable<any> {
    return this.http.get<any>(`${this.API_URL}/api/formations/${id}`);
  }

  addFormation(data: any): Observable<any> {
    return this.http.post<any>(`${this.API_URL}/api/formations`, data);
  }

  // Directories
  getDirectories(): Observable<any[]> {
    return this.http.get<any[]>(`${this.API_URL}/api/directories`);
  }

  addDirectories(data: any): Observable<any> {
    return this.http.post<any>(`${this.API_URL}/api/directories`, data);
  }

  // Blog / Articles
  getArticles(): Observable<any[]> {
    return this.http.get<any[]>(`${this.API_URL}/api/articles`);
  }

  getArticleById(id: string): Observable<any> {
    return this.http.get<any>(`${this.API_URL}/api/articles/${id}`);
  }

  addArticle(data: any): Observable<any> {
    return this.http.post<any>(`${this.API_URL}/api/articles`, data);
  }

  // Appointments
  getAppointments(): Observable<any[]> {
    return this.http.get<any[]>(`${this.API_URL}/api/appointments`);
  }

  addAppointment(data: any): Observable<any> {
    return this.http.post<any>(`${this.API_URL}/api/appointments`, data);
  }


}

  
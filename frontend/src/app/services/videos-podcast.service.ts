import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VideosPodcastService {

  private apiUrl = 'http://localhost:5000/api/videos-podcasts';

  constructor(private http: HttpClient) {}

  getVideosPodcasts(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

    getVideosPodcastsById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  addVideosPodcasts(VideosPodcasts: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, VideosPodcasts);
  }
}

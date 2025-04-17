import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DirectoryService {

  private apiUrl = 'http://localhost:5000/api/directories';

  constructor(private http: HttpClient) {}

  getDirectories(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  addDirectories(directories: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, directories);
  }
}

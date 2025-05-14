import { Component, OnInit } from '@angular/core';
import { PagesService } from '../../services/pages.service';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-panneladmin',
  standalone: true,
  imports: [CommonModule,RouterModule],
  templateUrl: './panneladmin.component.html',
  styleUrls: ['./panneladmin.component.scss']
})
export class PanneladminComponent implements OnInit {
  users: any[] = [];
  articles: any[] = [];
  formations: any[] = [];
  appointments: any[] = [];
  directories: any[] = [];
  videosPodcasts: any[] = [];

  constructor(private pagesService: PagesService,
    private router: Router) {}
  

  ngOnInit(): void {
    this.pagesService.getUsers().subscribe(data => this.users = data);
    this.pagesService.getArticles().subscribe(data => this.articles = data);
    this.pagesService.getFormations().subscribe(data => this.formations = data);
    this.pagesService.getAppointments().subscribe(data => this.appointments = data);
    this.pagesService.getDirectories().subscribe(data => this.directories = data);
    this.pagesService.getVideosPodcasts().subscribe(data => this.videosPodcasts = data);
  }

  deleteUser(id: number): void {
    this.pagesService.deleteUser(id).subscribe(() => {
      this.users = this.users.filter(u => u.id !== id);
    });
  }

  deleteArticle(id: number): void {
    this.pagesService.deleteArticle(id).subscribe(() => {
      this.articles = this.articles.filter(a => a.id !== id);
    });
  }

  deleteFormation(id: number): void {
    this.pagesService.deleteFormation(id).subscribe(() => {
      this.formations = this.formations.filter(f => f.id !== id);
    });
  }

  deleteAppointment(id: number): void {
    this.pagesService.deleteAppointment(id).subscribe(() => {
      this.appointments = this.appointments.filter(a => a.id !== id);
    });
  }

  deleteDirectory(id: number): void {
    this.pagesService.deleteDirectory(id).subscribe(() => {
      this.directories = this.directories.filter(d => d.id !== id);
    });
  }

  deleteVideosPodcasts(id: number): void {
    this.pagesService.deleteVideosPodcasts(id).subscribe(() => {
      this.videosPodcasts = this.videosPodcasts.filter(v => v.id !== id);
    });
  }

  editArticle(id: string | undefined) {
    if (!id) {
      console.error('ID d’article non défini');
      return;
    }
    this.router.navigate(['/editArticle', id]);
  }

  editAppointment(id: string | undefined) {
    if (!id) {
      console.error('ID du RDV non défini');
      return;
    }
    this.router.navigate(['/editRdv', id]);
  }
  
  editFormation(id: string | undefined) {
    if (!id) {
      console.error('ID de la formation non défini');
      return;
    }
    this.router.navigate(['/editFormation', id]);
  }
  
  editDirectory(id: string | number) {
    this.router.navigate(['/editAnnuaire', id]);
  }
  
  editVideoPodcast(id: string | number) {
    this.router.navigate(['/editVideoPodcast', id]);
  }
  

  
}

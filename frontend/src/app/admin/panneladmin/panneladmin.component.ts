import { Component, OnInit } from '@angular/core';
import { PagesService } from '../../services/pages.service';
import { CommonModule } from '@angular/common'; // ⬅️ Import nécessaire

@Component({
  selector: 'app-panneladmin',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './panneladmin.component.html',
  styleUrls: ['./panneladmin.component.scss']
})
export class PanneladminComponent implements OnInit {
  users: any[] = [];
  articles: any[] = [];
  formations: any[] = [];
  appointments: any[] = [];

  constructor(private pagesService: PagesService) {}

  ngOnInit(): void {
    this.pagesService.getUsers().subscribe(data => this.users = data);
    this.pagesService.getArticles().subscribe(data => this.articles = data);
    this.pagesService.getFormations().subscribe(data => this.formations = data);
    this.pagesService.getAppointments().subscribe(data => this.appointments = data);
  }
}

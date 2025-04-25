import { Component, OnInit } from '@angular/core';
import { PagesService } from '../../services/pages.service';
import { HeaderComponent } from '../../components/header/header.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { CommonModule } from '@angular/common'; 
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-mycours',
  standalone: true,
  imports: [FooterComponent,HeaderComponent,CommonModule,RouterModule],
  templateUrl: './mycours.component.html',
  styleUrl: './mycours.component.scss'
})
export class MycoursComponent implements OnInit {
  formations: any[] = [];

  constructor(private pagesService: PagesService) {}

  ngOnInit(): void {
    this.pagesService.getMyFormations().subscribe({
      next: (data) => {
        this.formations = data;
        console.log(data)
      },
      error: (err) => {
        console.error('Erreur lors du chargement des formations', err);
      }
    });
  }
}

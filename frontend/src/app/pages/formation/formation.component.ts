import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from '../../components/header/header.component';  
import { FooterComponent } from '../../components/footer/footer.component'; 
import { CommonModule } from '@angular/common'; 
import { PagesService } from '../../services/pages.service';

@Component({
  selector: 'app-formation',
  standalone: true,
  imports: [RouterModule, HeaderComponent, FooterComponent,CommonModule],
  templateUrl: './formation.component.html',
  styleUrl: './formation.component.scss'
})
export class FormationComponent {
  formations: any[] = [];

  constructor(private PagesService: PagesService) {}

  ngOnInit() {
    this.PagesService.getformations().subscribe(
      (data: any[]) => {
        this.formations = data;
         console.log(data);
      },
      (error: any) => {
        console.error('Erreur lors du chargement des Formations', error);
      }
    );
  }

}

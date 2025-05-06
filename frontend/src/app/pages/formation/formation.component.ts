import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from '../../header/headerFooter/header/header.component';
import { FooterComponent } from '../../header/headerFooter/footer/footer.component';
import { CommonModule } from '@angular/common'; 
import { PagesService } from '../../services/pages.service';
import { environment } from '../../environement';
@Component({
  selector: 'app-formation',
  standalone: true,
  imports: [RouterModule, HeaderComponent, FooterComponent,CommonModule],
  templateUrl: './formation.component.html',
  styleUrl: './formation.component.scss'
})
export class FormationComponent {
  formations: any[] = [];
  environment = environment;

  constructor(private PagesService: PagesService) {}

  ngOnInit() {
    this.PagesService.getFormations().subscribe(
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

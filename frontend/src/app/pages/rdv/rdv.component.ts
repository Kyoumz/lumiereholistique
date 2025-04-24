import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from '../../components/header/header.component';  
import { FooterComponent } from '../../components/footer/footer.component'; 
import { CommonModule } from '@angular/common'; 
import { PagesService } from '../../services/pages.service';
import { environment } from '../../environement';
@Component({
  selector: 'app-rdv',
  standalone: true,
  imports: [RouterModule, HeaderComponent, FooterComponent,CommonModule],
  templateUrl: './rdv.component.html',
  styleUrl: './rdv.component.scss'
})
export class RdvComponent {
  rdv: any[] = [];
  environment = environment;
  constructor(private PagesService: PagesService) {}

  ngOnInit() {
    this.PagesService.getAppointments().subscribe(
      (data: any[]) => {
        this.rdv = data;
        //  console.log(data);
      },
      (error: any) => {
        console.error('Erreur lors du chargement des rdv', error);
      }
    );
  }

}

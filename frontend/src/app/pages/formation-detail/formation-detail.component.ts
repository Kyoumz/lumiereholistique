import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormationsService } from '../../services/formations.service';
import { HeaderComponent } from '../../components/header/header.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { CommonModule } from '@angular/common'; 

@Component({
  selector: 'app-formation-detail',
  imports: [HeaderComponent, FooterComponent, CommonModule], 
  templateUrl: './formation-detail.component.html',
  styleUrls: ['./formation-detail.component.scss']
})
export class FormationDetailComponent implements OnInit {
  formation: any;

  constructor(private route: ActivatedRoute, private formationService: FormationsService) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.formationService.getFormationsById(+id).subscribe(
        (data) => {
          this.formation = data;
        },
        (error) => {
          console.error('Erreur lors de la récupération de la formation', error);
        }
      );
    }
  }
}


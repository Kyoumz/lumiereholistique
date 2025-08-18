import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HeaderComponent } from '../../header/headerFooter/header/header.component';
import { FooterComponent } from '../../header/headerFooter/footer/footer.component';
import { CommonModule } from '@angular/common'; 
import { PagesService } from '../../services/pages.service';
import { environment } from '../../environement';
import { StripeService } from '../../services/stripe.service';
@Component({
  selector: 'app-formation-detail',
  imports: [HeaderComponent, FooterComponent, CommonModule], 
  templateUrl: './formation-detail.component.html',
  styleUrls: ['./formation-detail.component.scss']
})
export class FormationDetailComponent implements OnInit {
  formation: any;
  environment = environment;

  constructor(private route: ActivatedRoute, private PagesService: PagesService,private stripeService: StripeService) {}

  // acheterFormation() {
  //   const id = this.formation?.id;
  //   if (!id) return;
  
  //   this.PagesService.addFormationToUser(id).subscribe(
  //     () => {
  //       alert('Formation ajoutée avec succès à votre compte !');
  //     },
  //     (error) => {
  //       console.error('Erreur lors de l’achat de la formation', error);
  //       alert('Erreur : impossible d’ajouter la formation.');
  //     }
  //   );
  // }


  acheterFormation() {
    if (!this.formation?.id) return;
  
    localStorage.setItem('formationToAdd', JSON.stringify({ id: this.formation.id }));
  
    this.stripeService.checkout(this.formation.id);
  }
  


  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.PagesService.getFormationsById(+id).subscribe(
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


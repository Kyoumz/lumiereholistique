import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PagesService } from '../../services/pages.service';
import { HeaderComponent } from '../../header/headerFooter/header/header.component';
import { FooterComponent } from '../../header/headerFooter/footer/footer.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-mycours',
  standalone: true,
  imports: [FooterComponent, HeaderComponent, CommonModule, RouterModule],
  templateUrl: './mycours.component.html',
  styleUrls: ['./mycours.component.scss']
})
export class MycoursComponent implements OnInit {
  formations: any[] = [];

  constructor(
    private pagesService: PagesService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const formationToAdd = localStorage.getItem('formationToAdd');
  
    if (formationToAdd) {
      const { id } = JSON.parse(formationToAdd);
      this.pagesService.addFormationToUser(id).subscribe({
        next: () => {
          console.log('✔ Formation ajoutée après paiement');
          localStorage.removeItem('formationToAdd');
          this.loadFormations();
        },
        error: (err) => {
          console.error('❌ Erreur ajout formation :', err);
          this.loadFormations(); // On charge quand même les formations
        }
      });
    } else {
      this.loadFormations();
    }
  }
  
  loadFormations() {
    this.pagesService.getMyFormations().subscribe({
      next: (data) => this.formations = data,
      error: (err) => console.error('Erreur chargement formations', err)
    });
  }
  

  goToFormation(id: number): void {
    this.router.navigate(['/mycours', id]);
  }
}

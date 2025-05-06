import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PagesService } from '../../../services/pages.service';
import { environment } from '../../../environement';
import { HeaderComponent } from '../../../header/headerFooter/header/header.component';
import { FooterComponent } from '../../../header/headerFooter/footer/footer.component';
@Component({
  selector: 'app-mycoursdetail',
  standalone: true,
  imports: [CommonModule,HeaderComponent,FooterComponent],
  templateUrl: './mycoursdetail.component.html',
  styleUrl: './mycoursdetail.component.scss'
})
export class MycoursdetailComponent {
  formation: any = null;
  environment = environment;

  constructor(private route: ActivatedRoute, private pagesService: PagesService) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.pagesService.getFormationWithChapters(+id).subscribe({
        next: (data) => this.formation = data,
        error: (err) => console.error('Erreur chargement formation', err)
      });
    }
  }

}

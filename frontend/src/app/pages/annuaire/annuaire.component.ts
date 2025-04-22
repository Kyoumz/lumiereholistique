import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { RouterModule } from '@angular/router';
import { HeaderComponent } from '../../components/header/header.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { PagesService } from '../../services/pages.service';
@Component({
  selector: 'app-annuaire',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    HeaderComponent,
    FooterComponent
  ],
  templateUrl: './annuaire.component.html',
  styleUrl: './annuaire.component.scss'
})
export class AnnuaireComponent implements OnInit {
  directories: any[] = [];

  constructor(private PagesService: PagesService) {}

  ngOnInit(): void {
    this.PagesService.getDirectories().subscribe({
      next: (data) => this.directories = data,
      error: (err) => console.error('Erreur API :', err)
    });
  }
}

import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from '../../components/header/header.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { CommonModule } from '@angular/common'; 
import { PagesService } from '../../services/pages.service';
@Component({
  selector: 'app-blog',
  standalone: true,
  imports: [RouterModule, HeaderComponent, FooterComponent, CommonModule], 
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.scss']
})
export class BlogComponent {
  articles: any[] = [];

  constructor(private PagesService: PagesService) {}

  ngOnInit() {
    this.PagesService.getArticles().subscribe(
      (data: any[]) => {
        this.articles = data;
        // console.log('Articles récupérés :', data);
      },
      (error: any) => {
        console.error('Erreur lors du chargement des articles', error);
      }
    );
  }
}

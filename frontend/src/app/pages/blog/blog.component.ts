import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from '../../components/header/header.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { BlogService } from '../../services/blog.service';
import { CommonModule } from '@angular/common'; 
@Component({
  selector: 'app-blog',
  standalone: true,
  imports: [RouterModule, HeaderComponent, FooterComponent, CommonModule], 
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.scss']
})
export class BlogComponent {
  articles: any[] = [];

  constructor(private blogService: BlogService) {}

  ngOnInit() {
    console.log('ngOnInit() appelé');
    this.blogService.getArticles().subscribe(
      (data: any[]) => {
        this.articles = data;
        console.log('Articles récupérés :', data);
      },
      (error: any) => {
        console.error('Erreur lors du chargement des articles', error);
      }
    );
  }
}

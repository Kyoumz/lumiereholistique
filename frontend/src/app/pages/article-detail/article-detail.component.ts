import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BlogService } from '../../services/blog.service';
import { HeaderComponent } from '../../components/header/header.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { CommonModule } from '@angular/common'; 
import { FormsModule } from '@angular/forms'; 

@Component({
  selector: 'app-article-detail',
  standalone: true,
  imports: [HeaderComponent, FooterComponent, CommonModule, FormsModule], 
  templateUrl: './article-detail.component.html',
  styleUrls: ['./article-detail.component.scss']
})
export class ArticleDetailComponent implements OnInit {
  article: any;
  comment = { name: '', email: '', website: '', message: '' };
  comments: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private blogService: BlogService
  ) {}

  ngOnInit(): void {
    const articleId = this.route.snapshot.paramMap.get('id');
    if (articleId) {
      this.blogService.getArticleById(articleId).subscribe(
        (data) => {
          this.article = data;
        },
        (error) => {
          console.error('Erreur lors de la récupération de l\'article', error);
        }
      );
    }
  }

  submitComment() {
    if (this.comment.message && this.comment.name && this.comment.email) {
      this.comments.push({ ...this.comment });
      this.comment = { name: '', email: '', website: '', message: '' }; 
    }
  }
}

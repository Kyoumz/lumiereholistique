import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HeaderComponent } from '../../header/headerFooter/header/header.component';
import { FooterComponent } from '../../header/headerFooter/footer/footer.component';
import { CommonModule } from '@angular/common'; 
import { FormsModule } from '@angular/forms'; 
import { PagesService } from '../../services/pages.service';
import { environment } from '../../environement';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-article-detail',
  standalone: true,
  imports: [HeaderComponent, FooterComponent, CommonModule, FormsModule], 
  templateUrl: './article-detail.component.html',
  styleUrls: ['./article-detail.component.scss']
})
export class ArticleDetailComponent implements OnInit {
  article: any;
  safeContent: SafeHtml = '';
  environment = environment;
  comment = { author: '', content: '' };
  comments: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private PagesService: PagesService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    const articleId = this.route.snapshot.paramMap.get('id');
    if (articleId) {
      this.PagesService.getArticleById(articleId).subscribe(
        (data) => {
          this.article = data;
          // On sécurise le HTML tout en conservant les styles
          this.safeContent = this.sanitizer.bypassSecurityTrustHtml(this.article.content);
          this.loadComments(articleId);
        },
        (error) => {
          console.error('Erreur article :', error);
        }
      );
    }
  }

  loadComments(articleId: string) {
    this.PagesService.getCommentsByArticleId(articleId).subscribe(
      (data) => {
        this.comments = data;
      },
      (err) => console.error('Erreur chargement commentaires :', err)
    );
  }

  submitComment() {
    const articleId = this.route.snapshot.paramMap.get('id');
    if (articleId && this.comment.author && this.comment.content) {
      this.PagesService.addCommentToArticle(articleId, this.comment).subscribe(
        (newComment) => {
          this.comments.unshift(newComment); // ajoute le nouveau en haut
          this.comment = { author: '', content: '' };
        },
        (err) => {
          console.error('Erreur ajout commentaire :', err);
        }
      );
    }
  }
}

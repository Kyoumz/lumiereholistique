import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { BlogService } from '../../services/blog.service';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../components/header/header.component';

@Component({
  selector: 'app-article-form',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule, CommonModule, HeaderComponent],
  templateUrl: './article-form.component.html',
  styleUrl: './article-form.component.scss'
})
export class ArticleFormComponent {
  articleForm: FormGroup;

  constructor(private fb: FormBuilder, private blogService: BlogService) {
    this.articleForm = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      content: ['', Validators.required],
      image: ['']
    });
  }

  submitForm() {
    event?.preventDefault();
    console.log('Formulaire soumis');

    if (this.articleForm.valid) {
      this.blogService.addArticle(this.articleForm.value).subscribe({
        next: (res) => {
          console.log('Article ajouté:', res);
          this.articleForm.reset();
        },
        error: (err) => {
          console.error('Erreur lors de l’ajout de l’article:', err);
        }
      });
    }
  }
}

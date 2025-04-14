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
  successMessage = '';
  errorMessage = '';

  constructor(private fb: FormBuilder, private blogService: BlogService) {
    this.articleForm = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      content: ['', Validators.required],
      image: ['']
    });
  }

  submitForm() {
    if (this.articleForm.valid) {
      this.blogService.addArticle(this.articleForm.value).subscribe({
        next: (res) => {
          this.successMessage = 'Article ajouté avec succès !';
          this.errorMessage = '';
          this.articleForm.reset();
        },
        error: (err) => {
          this.successMessage = '';
          this.errorMessage = "Erreur lors de l’ajout de l’article.";
          console.error(err);
        }
      });
    } else {
      this.successMessage = '';
      this.errorMessage = 'Veuillez remplir tous les champs requis.';
    }
  }
}

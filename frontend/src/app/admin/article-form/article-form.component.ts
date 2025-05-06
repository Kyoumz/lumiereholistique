import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../header/footer/header/header.component';
import { PagesService } from '../../services/pages.service';

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
  selectedImage: File | null = null;
  imagePreview: string | null = null;

  constructor(private fb: FormBuilder, private PagesService: PagesService) {
    this.articleForm = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      content: ['', Validators.required]
    });
  }

  onImageSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedImage = file;
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  submitForm() {
    if (this.articleForm.valid) {
      const formData = new FormData();
      formData.append('title', this.articleForm.get('title')?.value);
      formData.append('description', this.articleForm.get('description')?.value);
      formData.append('content', this.articleForm.get('content')?.value);
      if (this.selectedImage) {
        formData.append('image', this.selectedImage);
      }

      this.PagesService.addArticle(formData).subscribe({
        next: () => {
          this.successMessage = 'Article ajouté avec succès !';
          this.errorMessage = '';
          this.articleForm.reset();
          this.selectedImage = null;
          this.imagePreview = null;
        },
        error: (err) => {
          this.successMessage = '';
          this.errorMessage = 'Erreur lors de l’ajout de l’article.';
          console.error(err);
        }
      });
    } else {
      this.successMessage = '';
      this.errorMessage = 'Veuillez remplir tous les champs requis.';
    }
  }
}

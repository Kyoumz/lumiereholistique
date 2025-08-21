import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PagesService } from '../../services/pages.service';
import { EditorModule } from '@tinymce/tinymce-angular';

@Component({
  selector: 'app-article-form',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule, CommonModule,EditorModule],
  templateUrl: './article-form.component.html',
  styleUrl: './article-form.component.scss'
})
export class ArticleFormComponent implements OnInit {
  articleForm: FormGroup;
  successMessage = '';
  errorMessage = '';
  selectedImage: File | null = null;
  imagePreview: string | null = null;
  isEditMode = false;
  articleId: string | null = null;


  editorConfig = {
    editable: true,
    spellcheck: true,
    height: '15rem',
    minHeight: '5rem',
    placeholder: 'Écris ton article ici...',
    translate: 'no',
    defaultParagraphSeparator: 'p',
    defaultFontName: 'Arial',
    toolbarHiddenButtons: [
      [], 
      []  
    ]
  };

  constructor(
    private fb: FormBuilder,
    private pagesService: PagesService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.articleForm = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      content: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.articleId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.articleId;

    if (this.isEditMode && this.articleId) {
      this.pagesService.getArticleById(this.articleId).subscribe(article => {
        this.articleForm.patchValue({
          title: article.title,
          description: article.description,
          content: article.content
        });
        this.imagePreview = article.imageUrl; // assure-toi que le backend renvoie bien ce champ
      });
    }
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
    if (this.articleForm.invalid) {
      this.successMessage = '';
      this.errorMessage = 'Veuillez remplir tous les champs requis.';
      return;
    }

    const formData = new FormData();
    formData.append('title', this.articleForm.get('title')?.value);
    formData.append('description', this.articleForm.get('description')?.value);
    formData.append('content', this.articleForm.get('content')?.value);
    if (this.selectedImage) {
      formData.append('image', this.selectedImage);
    }

    if (this.isEditMode && this.articleId) {
      this.pagesService.updateArticle(this.articleId, formData).subscribe({
        next: () => {
          this.successMessage = 'Article mis à jour avec succès !';
          this.router.navigate(['/admin']);
        },
        error: (err) => {
          this.errorMessage = 'Erreur lors de la mise à jour.';
          console.error(err);
        }
      });
    } else {
      this.pagesService.addArticle(formData).subscribe({
        next: () => {
          this.successMessage = 'Article ajouté avec succès !';
          this.articleForm.reset();
          this.imagePreview = null;
          this.selectedImage = null;
        },
        error: (err) => {
          this.errorMessage = 'Erreur lors de l’ajout de l’article.';
          console.error(err);
        }
      });
    }
  }
}

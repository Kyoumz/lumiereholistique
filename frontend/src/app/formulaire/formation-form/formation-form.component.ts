import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from '../../components/header/header.component';
import { PagesService } from '../../services/pages.service';

@Component({
  selector: 'app-formation-form',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule, CommonModule, HeaderComponent],
  templateUrl: './formation-form.component.html',
  styleUrls: ['./formation-form.component.scss']
})
export class FormationFormComponent {
  formationForm: FormGroup;
  successMessage = '';
  errorMessage = '';
  selectedImage: File | null = null;
  imagePreview: string | null = null;

  constructor(
    private fb: FormBuilder,
    private PagesService: PagesService
  ) {
    this.formationForm = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      content: ['', Validators.required],
      image: [''],
      price: [0, [Validators.required, Validators.min(0)]]
    });
  }

  // Méthode pour gérer l'upload de l'image
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

  // Méthode de soumission du formulaire
  submitForm() {
    if (this.formationForm.valid) {
      const formData = new FormData();
      formData.append('title', this.formationForm.get('title')?.value);
      formData.append('description', this.formationForm.get('description')?.value);
      formData.append('content', this.formationForm.get('content')?.value);
      formData.append('price', this.formationForm.get('price')?.value.toString());

      if (this.selectedImage) {
        formData.append('image', this.selectedImage); // Ajoute l'image
      }

      this.PagesService.addFormation(formData).subscribe({
        next: (res) => {
          this.successMessage = 'Formation ajoutée avec succès !';
          this.errorMessage = '';
          this.formationForm.reset();
          this.imagePreview = null;
          this.selectedImage = null;
        },
        error: (err) => {
          this.successMessage = '';
          this.errorMessage = 'Erreur lors de l’ajout de la formation.';
          console.error(err); // Affiche l'erreur
        }
      });
    } else {
      this.successMessage = '';
      this.errorMessage = 'Veuillez remplir tous les champs requis.';
    }
  }
}

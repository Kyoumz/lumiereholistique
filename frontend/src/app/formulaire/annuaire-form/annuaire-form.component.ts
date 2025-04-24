import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../components/header/header.component';
import { PagesService } from '../../services/pages.service';

@Component({
  selector: 'app-annuaire-form',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule, CommonModule, HeaderComponent],
  templateUrl: './annuaire-form.component.html',
  styleUrl: './annuaire-form.component.scss'
})

export class AnnuaireFormComponent {
  directoryForm: FormGroup;
  successMessage = '';
  errorMessage = '';
  selectedImage: File | null = null;
  imagePreview: string | null = null;

  constructor(private fb: FormBuilder, private PagesService: PagesService) {
    this.directoryForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      image: [''] // on garde juste pour compatibilité
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
    if (this.directoryForm.valid) {
      const formData = new FormData();
      formData.append('name', this.directoryForm.get('name')?.value);
      formData.append('description', this.directoryForm.get('description')?.value);

      if (this.selectedImage) {
        formData.append('image', this.selectedImage);
      }

      this.PagesService.addDirectories(formData).subscribe({
        next: (res) => {
          this.successMessage = 'Entrée ajoutée avec succès !';
          this.errorMessage = '';
          this.directoryForm.reset();
          this.selectedImage = null;
          this.imagePreview = null;
        },
        error: (err) => {
          this.successMessage = '';
          this.errorMessage = "Erreur lors de l’ajout.";
          console.error(err);
        }
      });
    } else {
      this.successMessage = '';
      this.errorMessage = 'Veuillez remplir tous les champs requis.';
    }
  }
}

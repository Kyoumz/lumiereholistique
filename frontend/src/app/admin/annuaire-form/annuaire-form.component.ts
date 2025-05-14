import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PagesService } from '../../services/pages.service';

@Component({
  selector: 'app-annuaire-form',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule, CommonModule],
  templateUrl: './annuaire-form.component.html',
  styleUrl: './annuaire-form.component.scss'
})
export class AnnuaireFormComponent implements OnInit {
  directoryForm: FormGroup;
  successMessage = '';
  errorMessage = '';
  selectedImage: File | null = null;
  imagePreview: string | null = null;
  isEditMode = false;
  directoryId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private PagesService: PagesService,
    private route: ActivatedRoute
  ) {
    this.directoryForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      image: [''] // pour compatibilité avec l'API
    });
  }

  ngOnInit(): void {
    this.directoryId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.directoryId;

    if (this.isEditMode && this.directoryId) {
      this.PagesService.getDirectoryById(this.directoryId).subscribe({
        next: (data) => {
          this.directoryForm.patchValue({
            name: data.name,
            description: data.description
          });

          if (data.image) {
            this.imagePreview = data.image;
          }
        },
        error: (err) => {
          this.errorMessage = 'Erreur lors du chargement des données.';
          console.error(err);
        }
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
    if (this.directoryForm.valid) {
      const formData = new FormData();
      formData.append('name', this.directoryForm.get('name')?.value);
      formData.append('description', this.directoryForm.get('description')?.value);

      if (this.selectedImage) {
        formData.append('image', this.selectedImage);
      }

      const request = this.isEditMode && this.directoryId
        ? this.PagesService.updateDirectory(this.directoryId, formData)
        : this.PagesService.addDirectories(formData);

      request.subscribe({
        next: () => {
          this.successMessage = this.isEditMode ? 'Entrée mise à jour avec succès !' : 'Entrée ajoutée avec succès !';
          this.errorMessage = '';
          this.directoryForm.reset();
          this.selectedImage = null;
          this.imagePreview = null;
        },
        error: (err) => {
          this.successMessage = '';
          this.errorMessage = 'Erreur lors de la soumission.';
          console.error(err);
        }
      });
    } else {
      this.successMessage = '';
      this.errorMessage = 'Veuillez remplir tous les champs requis.';
    }
  }
}

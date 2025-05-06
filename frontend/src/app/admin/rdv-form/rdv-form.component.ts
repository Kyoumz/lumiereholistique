import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from '../../header/headerFooter/header/header.component';
import { PagesService } from '../../services/pages.service';

@Component({
  selector: 'app-rdv-form',
  standalone: true,
  imports: [RouterModule, HeaderComponent, CommonModule, ReactiveFormsModule],
  templateUrl: './rdv-form.component.html',
  styleUrl: './rdv-form.component.scss'
})
export class RdvFormComponent {
  appointmentForm: FormGroup;
  successMessage = '';
  errorMessage = '';
  selectedImage: File | null = null;
  imagePreview: string | null = null;

  constructor(
    private fb: FormBuilder,
    private PagesService: PagesService,
    private router: Router
  ) {
    this.appointmentForm = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      link: ['']
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
    if (this.appointmentForm.valid) {
      const formData = new FormData();
      formData.append('title', this.appointmentForm.get('title')?.value);
      formData.append('description', this.appointmentForm.get('description')?.value);
      formData.append('link', this.appointmentForm.get('link')?.value);
      if (this.selectedImage) {
        formData.append('image', this.selectedImage);
      }

      this.PagesService.addAppointment(formData).subscribe({
        next: () => {
          this.successMessage = 'RDV ajouté avec succès !';
          this.errorMessage = '';
          this.appointmentForm.reset();
          this.selectedImage = null;
          this.imagePreview = null;
        },
        error: (error) => {
          this.successMessage = '';
          this.errorMessage = 'Erreur lors de l’ajout du RDV.';
          console.error(error);
        }
      });
    } else {
      this.successMessage = '';
      this.errorMessage = 'Veuillez remplir les champs requis.';
    }
  }
}

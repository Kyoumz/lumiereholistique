import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PagesService } from '../../services/pages.service';

@Component({
  selector: 'app-rdv-form',
  standalone: true,
  imports: [RouterModule, CommonModule, ReactiveFormsModule],
  templateUrl: './rdv-form.component.html',
  styleUrl: './rdv-form.component.scss'
})
export class RdvFormComponent implements OnInit {
  appointmentForm: FormGroup;
  successMessage = '';
  errorMessage = '';
  selectedImage: File | null = null;
  imagePreview: string | null = null;
  isEditMode = false;
  rdvId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private PagesService: PagesService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.appointmentForm = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      link: ['']
    });
  }

  ngOnInit(): void {
    this.rdvId = this.route.snapshot.paramMap.get('id');
    if (this.rdvId) {
      this.isEditMode = true;
      this.PagesService.getAppointmentById(this.rdvId).subscribe({
        next: (rdv) => {
          this.appointmentForm.patchValue({
            title: rdv.title,
            description: rdv.description,
            link: rdv.link
          });
          if (rdv.image) {
            this.imagePreview = rdv.image;
          }
        },
        error: (err) => {
          console.error('Erreur lors du chargement du RDV', err);
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
    if (this.appointmentForm.valid) {
      const formData = new FormData();
      formData.append('title', this.appointmentForm.get('title')?.value);
      formData.append('description', this.appointmentForm.get('description')?.value);
      formData.append('link', this.appointmentForm.get('link')?.value);
      if (this.selectedImage) {
        formData.append('image', this.selectedImage);
      }

      const request$ = this.isEditMode
        ? this.PagesService.updateAppointment(this.rdvId!, formData)
        : this.PagesService.addAppointment(formData);

      request$.subscribe({
        next: () => {
          this.successMessage = this.isEditMode
            ? 'RDV modifié avec succès !'
            : 'RDV ajouté avec succès !';
          this.errorMessage = '';
          this.appointmentForm.reset();
          this.selectedImage = null;
          this.imagePreview = null;
        },
        error: (error) => {
          this.successMessage = '';
          this.errorMessage = 'Erreur lors de l’envoi du RDV.';
          console.error(error);
        }
      });
    } else {
      this.successMessage = '';
      this.errorMessage = 'Veuillez remplir les champs requis.';
    }
  }
}

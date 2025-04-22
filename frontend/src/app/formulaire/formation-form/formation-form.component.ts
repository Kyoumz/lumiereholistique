import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from '../../components/header/header.component';
import { PagesService } from '../../services/auth.service';

@Component({
  selector: 'app-formation-form',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule, CommonModule, HeaderComponent],
  templateUrl: './formation-form.component.html',
  styleUrl: './formation-form.component.scss'
})
export class FormationFormComponent {
  formationForm: FormGroup;
  successMessage = '';
  errorMessage = '';

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

  submitForm() {
    if (this.formationForm.valid) {
      this.PagesService.addFormation(this.formationForm.value).subscribe({
        next: (res) => {
          this.successMessage = 'Formation ajoutée avec succès !';
          this.errorMessage = '';
          this.formationForm.reset();
        },
        error: (err) => {
          this.successMessage = '';
          this.errorMessage = 'Erreur lors de l’ajout de la formation.';
          console.error(err);
        }
      });
    } else {
      this.successMessage = '';
      this.errorMessage = 'Veuillez remplir tous les champs requis.';
    }
  }
}

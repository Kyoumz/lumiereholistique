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

  constructor(private fb: FormBuilder, private PagesService: PagesService) {
    this.directoryForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      image: ['']
    });
  }

  submitForm() {
    if (this.directoryForm.valid) {
      this.PagesService.addDirectories(this.directoryForm.value).subscribe({
        next: (res) => {
          this.successMessage = 'Entrée ajoutée avec succès !';
          this.errorMessage = '';
          this.directoryForm.reset();
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

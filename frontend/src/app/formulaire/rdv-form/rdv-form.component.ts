import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AppointmentsService } from '../../services/appointments.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from '../../components/header/header.component';

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

  constructor(
    private fb: FormBuilder,
    private appointmentsService: AppointmentsService,
    private router: Router
  ) {
    this.appointmentForm = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      image: [''],
      link: ['']
    });
  }

  submitForm() {
    if (this.appointmentForm.valid) {
      const appointmentData = this.appointmentForm.value;

      this.appointmentsService.addAppointment(appointmentData).subscribe({
        next: (response) => {
          this.successMessage = 'RDV ajouté avec succès !';
          this.errorMessage = '';
          this.appointmentForm.reset();
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

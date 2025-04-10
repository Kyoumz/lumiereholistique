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

  constructor(
    private fb: FormBuilder,
    private appointmentsService: AppointmentsService,
    private router: Router
  ) {
    this.appointmentForm = this.fb.group({
      title: ['test'],
      description: ['aaa'],
      image: ['aa'],
      link: ['aa'],
    });
  }

  submitForm() {
    console.log('submitForm() appelé'); 

  }
}

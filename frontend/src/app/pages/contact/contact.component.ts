import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from '../../header/headerFooter/header/header.component';
import { FooterComponent } from '../../header/headerFooter/footer/footer.component';
import { EmailService } from '../../services/email.service';
import { NgForm, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [RouterModule, HeaderComponent, FooterComponent, FormsModule, CommonModule],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss'
})
export class ContactComponent {
  contact = {
    nom: '',
    email: '',
    message: ''
  };

  messageEnvoye = false;
  erreurEnvoi = false;

  constructor(private emailService: EmailService) {}

  onSubmit(): void {
    this.emailService.sendContactMessage(this.contact).subscribe({
      next: () => {
        this.messageEnvoye = true;
        this.erreurEnvoi = false;
        this.contact = { nom: '', email: '', message: '' }; // reset form
      },
      error: () => {
        this.messageEnvoye = false;
        this.erreurEnvoi = true;
      }
    });
  }
}

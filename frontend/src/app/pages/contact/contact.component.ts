import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from '../../header/footer/header/header.component';  
import { FooterComponent } from '../../header/footer/footer/footer.component'; 
import { EmailService } from '../../services/email.service'

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [RouterModule, HeaderComponent, FooterComponent],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss'
})
export class ContactComponent {

}




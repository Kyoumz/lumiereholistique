import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from '../../header/footer/header/header.component';  
import { FooterComponent } from '../../header/footer/footer/footer.component'; 

@Component({
  selector: 'app-sante',
  standalone: true,
  imports: [RouterModule, HeaderComponent, FooterComponent],
  templateUrl: './sante.component.html',
  styleUrl: './sante.component.scss'
})
export class SanteComponent {

}

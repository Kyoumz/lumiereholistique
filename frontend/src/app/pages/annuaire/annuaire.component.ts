import { Component } from '@angular/core';
import { HeaderComponent } from '../../components/header/header.component';  
import { FooterComponent } from '../../components/footer/footer.component'; 
import { RouterModule } from '@angular/router';
@Component({
  selector: 'app-annuaire',
  standalone: true,
  imports: [RouterModule, HeaderComponent, FooterComponent],
  templateUrl: './annuaire.component.html',
  styleUrl: './annuaire.component.scss'
})
export class AnnuaireComponent {

}

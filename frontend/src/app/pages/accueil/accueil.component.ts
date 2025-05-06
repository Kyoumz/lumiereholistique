import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from '../../header/headerFooter/header/header.component';
import { FooterComponent } from '../../header/headerFooter/footer/footer.component';
@Component({
  selector: 'app-accueil',
  standalone: true,
  imports: [RouterModule, HeaderComponent, FooterComponent],
  templateUrl: './accueil.component.html',
  styleUrls: ['./accueil.component.scss']
})
export class AccueilComponent { 




}

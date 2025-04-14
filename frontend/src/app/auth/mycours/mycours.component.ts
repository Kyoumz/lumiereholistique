import { Component } from '@angular/core';
import { HeaderComponent } from '../../components/header/header.component';  
import { FooterComponent } from '../../components/footer/footer.component'; 
import { RouterModule } from '@angular/router';
@Component({
  selector: 'app-mycours',
  standalone: true,
  imports: [RouterModule, HeaderComponent, FooterComponent],
  templateUrl: './mycours.component.html',
  styleUrl: './mycours.component.scss'
})
export class MycoursComponent {

}

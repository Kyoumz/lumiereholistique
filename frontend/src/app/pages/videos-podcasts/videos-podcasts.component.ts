import { Component } from '@angular/core';
import { HeaderComponent } from '../../components/header/header.component';  
import { FooterComponent } from '../../components/footer/footer.component'; 
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-videos-podcasts',
  standalone: true,
  imports: [RouterModule, HeaderComponent, FooterComponent],
  templateUrl: './videos-podcasts.component.html',
  styleUrl: './videos-podcasts.component.scss'
})
export class VideosPodcastsComponent {
  logMessage() {
    console.log('Bouton cliqué !');
  }
}

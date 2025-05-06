import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from '../../header/headerFooter/header/header.component';
import { FooterComponent } from '../../header/headerFooter/footer/footer.component';
import { HttpClientModule } from '@angular/common/http';
import { PagesService } from '../../services/pages.service';
import { environment } from '../../environement';
@Component({
  selector: 'app-videos-podcasts',
  standalone: true,
  imports: [CommonModule, RouterModule, HeaderComponent, FooterComponent, HttpClientModule],
  templateUrl: './videos-podcasts.component.html',
  styleUrl: './videos-podcasts.component.scss'
})
export class VideosPodcastsComponent implements OnInit {
  videosPodcasts: any[] = [];
  environment = environment;


  constructor(private PagesService: PagesService) {}

  ngOnInit(): void {
    this.PagesService.getVideosPodcasts().subscribe(data => {
      this.videosPodcasts = data;
    });
  }
}


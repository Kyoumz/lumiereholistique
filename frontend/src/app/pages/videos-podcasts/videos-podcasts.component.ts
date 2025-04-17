import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from '../../components/header/header.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { VideosPodcastService } from '../../services/videos-podcast.service'; // adapte le chemin
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-videos-podcasts',
  standalone: true,
  imports: [CommonModule, RouterModule, HeaderComponent, FooterComponent, HttpClientModule],
  templateUrl: './videos-podcasts.component.html',
  styleUrl: './videos-podcasts.component.scss'
})
export class VideosPodcastsComponent implements OnInit {
  videos: any[] = [];
  podcasts: any[] = [];

  constructor(private vpService: VideosPodcastService) {}

  ngOnInit(): void {
    this.vpService.getVideosPodcasts().subscribe(data => {
      this.videos = data.filter(item => item.video);
      this.podcasts = data.filter(item => item.podcast);
    });
  }

  extractYouTubeId(url: string): string {
    const regExp = /(?:\?v=|\/embed\/|\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(regExp);
    return match ? match[1] : '';
  }
}

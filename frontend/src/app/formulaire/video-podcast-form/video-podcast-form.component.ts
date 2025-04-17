import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { VideosPodcastService } from '../../services/videos-podcast.service'; // Adapte le chemin vers ton service
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from '../../components/header/header.component';

@Component({
  selector: 'app-video-podcast-form',
  standalone: true,
  imports: [RouterModule, HeaderComponent, CommonModule, ReactiveFormsModule],
  templateUrl: './video-podcast-form.component.html',
  styleUrls: ['./video-podcast-form.component.scss']
})
export class VideoPodcastFormComponent {
  videoPodcastForm: FormGroup;
  successMessage = '';
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private vpService: VideosPodcastService,
    private router: Router
  ) {
    this.videoPodcastForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      video: ['', Validators.required], // Lien vidéo
      podcast: ['', Validators.required] // Lien podcast
    });
  }

  submitForm() {
    if (this.videoPodcastForm.valid) {
      const videoPodcastData = this.videoPodcastForm.value;

      this.vpService.addVideosPodcasts(videoPodcastData).subscribe({
        next: (response) => {
          this.successMessage = 'Vidéo/Podcast ajouté avec succès !';
          this.errorMessage = '';
          this.videoPodcastForm.reset();
        },
        error: (error) => {
          this.successMessage = '';
          this.errorMessage = 'Erreur lors de l’ajout du vidéo/podcast.';
          console.error(error);
        }
      });
    } else {
      this.successMessage = '';
      this.errorMessage = 'Veuillez remplir les champs requis.';
    }
  }
}

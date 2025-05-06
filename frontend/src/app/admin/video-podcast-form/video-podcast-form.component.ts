import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PagesService } from '../../services/pages.service';
import { HeaderComponent } from '../../header/footer/header/header.component';

@Component({
  selector: 'app-video-podcast-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, HeaderComponent],
  templateUrl: './video-podcast-form.component.html',
  styleUrls: ['./video-podcast-form.component.scss']
})
export class VideoPodcastFormComponent {
  videoPodcastForm: FormGroup;
  selectedFile!: File;
  successMessage = '';
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private pagesService: PagesService
  ) {
    this.videoPodcastForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      themes: [''],
      file: [null, Validators.required]
    });
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.selectedFile = input.files[0];

      // Synchronise avec le formControl
      this.videoPodcastForm.patchValue({ file: this.selectedFile });
      this.videoPodcastForm.get('file')?.updateValueAndValidity();
    }
  }

  submitForm() {
    if (!this.videoPodcastForm.valid || !this.selectedFile) {
      this.errorMessage = 'Veuillez remplir tous les champs requis.';
      this.successMessage = '';
      return;
    }

    const formData = new FormData();
    formData.append('title', this.videoPodcastForm.get('title')?.value);
    formData.append('description', this.videoPodcastForm.get('description')?.value);
    formData.append('themes', this.videoPodcastForm.get('themes')?.value || '');
    formData.append('file', this.selectedFile);

    this.pagesService.addVideosPodcasts(formData).subscribe({
      next: () => {
        this.successMessage = 'Vidéo ou podcast ajouté avec succès !';
        this.errorMessage = '';
        this.videoPodcastForm.reset();
      },
      error: (err) => {
        this.errorMessage = 'Erreur lors de l’envoi du fichier.';
        this.successMessage = '';
        console.error(err);
      }
    });
  }
}

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PagesService } from '../../services/pages.service';

@Component({
  selector: 'app-video-podcast-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './video-podcast-form.component.html',
  styleUrls: ['./video-podcast-form.component.scss']
})
export class VideoPodcastFormComponent implements OnInit {
  videoPodcastForm: FormGroup;
  selectedFile!: File;
  successMessage = '';
  errorMessage = '';
  isEditMode = false;
  videoPodcastId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private pagesService: PagesService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.videoPodcastForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      themes: [''],
      file: [null]
    });
  }

  ngOnInit() {
    this.videoPodcastId = this.route.snapshot.paramMap.get('id');
    if (this.videoPodcastId) {
      this.isEditMode = true;
      this.pagesService.getVideoPodcastById(this.videoPodcastId).subscribe(data => {
        this.videoPodcastForm.patchValue({
          title: data.title,
          description: data.description,
          themes: data.themes
        });
      });
    }
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.selectedFile = input.files[0];
      this.videoPodcastForm.patchValue({ file: this.selectedFile });
      this.videoPodcastForm.get('file')?.updateValueAndValidity();
    }
  }

  submitForm() {
    if (!this.videoPodcastForm.valid) {
      this.errorMessage = 'Veuillez remplir tous les champs requis.';
      this.successMessage = '';
      return;
    }

    const formData = new FormData();
    formData.append('title', this.videoPodcastForm.get('title')?.value);
    formData.append('description', this.videoPodcastForm.get('description')?.value);
    formData.append('themes', this.videoPodcastForm.get('themes')?.value || '');

    if (this.selectedFile) {
      formData.append('file', this.selectedFile);
    }

    if (this.isEditMode && this.videoPodcastId) {
      this.pagesService.updateVideoPodcast(this.videoPodcastId, formData).subscribe({
        next: () => {
          this.successMessage = 'Modification réussie !';
          this.errorMessage = '';
        },
        error: (err) => {
          this.errorMessage = 'Erreur lors de la modification.';
          this.successMessage = '';
          console.error(err);
        }
      });
    } else {
      this.pagesService.addVideosPodcasts(formData).subscribe({
        next: () => {
          this.successMessage = 'Ajout réussi !';
          this.errorMessage = '';
          this.videoPodcastForm.reset();
        },
        error: (err) => {
          this.errorMessage = 'Erreur lors de l’ajout.';
          this.successMessage = '';
          console.error(err);
        }
      });
    }
  }
}

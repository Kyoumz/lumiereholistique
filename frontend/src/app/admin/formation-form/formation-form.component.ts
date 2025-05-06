import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormArray } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from '../../header/footer/header/header.component';
import { PagesService } from '../../services/pages.service';

@Component({
  selector: 'app-formation-form',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule, CommonModule, HeaderComponent],
  templateUrl: './formation-form.component.html',
  styleUrls: ['./formation-form.component.scss']
})
export class FormationFormComponent {
  formationForm: FormGroup;
  videoFiles: File[] = [];
  selectedImage: File | null = null;
  imagePreview: string | null = null;
  successMessage = '';
  errorMessage = '';

  get chapters(): FormArray {
    return this.formationForm.get('chapters') as FormArray;
  }

  constructor(private fb: FormBuilder, private PagesService: PagesService) {
    this.formationForm = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      content: ['', Validators.required],
      image: [''],
      price: [0, [Validators.required, Validators.min(0)]],
      chapters: this.fb.array([]) // FormArray ici
    });
  }

  addChapter() {
    const chapterGroup = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      video: ['']
    });
    this.chapters.push(chapterGroup);
  }

  removeChapter(index: number) {
    this.chapters.removeAt(index);
    this.videoFiles.splice(index, 1);
  }

  onVideoSelected(event: any, index: number) {
    const file = event.target.files[0];
    if (file) {
      this.videoFiles[index] = file;
    }
  }

  onImageSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedImage = file;
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  submitForm() {
    if (this.formationForm.valid) {
      const formData = new FormData();
      formData.append('title', this.formationForm.get('title')?.value);
      formData.append('description', this.formationForm.get('description')?.value);
      formData.append('content', this.formationForm.get('content')?.value);
      formData.append('price', this.formationForm.get('price')?.value.toString());
  
      // Ajouter l'image principale
      if (this.selectedImage) {
        formData.append('image', this.selectedImage);
      }
  
      // Préparer les chapitres à envoyer en JSON
      const chaptersMetadata = this.chapters.controls.map((chapter, i) => {
        const chapterData: any = {
          title: chapter.get('title')?.value,
          description: chapter.get('description')?.value || ''
        };
  
        // Attacher l'index pour retrouver la vidéo côté backend
        if (this.videoFiles[i]) {
          chapterData.videoField = `video_chapter_${i}`;
          formData.append(chapterData.videoField, this.videoFiles[i]);
        }
  
        return chapterData;
      });
  
      // Ajouter les métadonnées des chapitres sous forme JSON
      formData.append('chapters', JSON.stringify(chaptersMetadata));
  
      // Envoi via le service
      this.PagesService.addFormation(formData).subscribe({
        next: () => {
          this.successMessage = 'Formation avec chapitres ajoutée !';
          this.errorMessage = '';
          this.formationForm.reset();
          this.imagePreview = null;
          this.chapters.clear();
          this.videoFiles = [];
        },
        error: (err) => {
          this.successMessage = '';
          this.errorMessage = 'Erreur lors de l’ajout.';
          console.error(err);
        }
      });
    } else {
      this.successMessage = '';
      this.errorMessage = 'Formulaire incomplet.';
    }
  }
  
}

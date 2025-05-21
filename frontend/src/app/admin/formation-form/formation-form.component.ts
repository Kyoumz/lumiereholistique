import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormArray } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { PagesService } from '../../services/pages.service';

@Component({
  selector: 'app-formation-form',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule, CommonModule],
  templateUrl: './formation-form.component.html',
  styleUrls: ['./formation-form.component.scss']
})
export class FormationFormComponent implements OnInit {
  formationForm: FormGroup;
  videoFiles: File[] = [];
  selectedImage: File | null = null;
  imagePreview: string | null = null;
  successMessage = '';
  errorMessage = '';
  formationId: string | null = null;

  get chapters(): FormArray {
    return this.formationForm.get('chapters') as FormArray;
  }

  constructor(
    private fb: FormBuilder,
    private pagesService: PagesService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.formationForm = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      content: ['', Validators.required],
      image: [''],
      price: [0, [Validators.required, Validators.min(0)]],
      chapters: this.fb.array([])
    });
  }

  ngOnInit(): void {
    this.formationId = this.route.snapshot.paramMap.get('id');
    if (this.formationId) {
      this.pagesService.getFormationsById(this.formationId).subscribe({
        next: (data) => {
          this.formationForm.patchValue({
            title: data.title,
            description: data.description,
            content: data.content,
            price: data.price
          });

          if (data.imageUrl) {
            this.imagePreview = data.imageUrl;
          }

          data.chapters.forEach((chapter: any) => {
            const chapterGroup = this.fb.group({
              title: [chapter.title, Validators.required],
              description: [chapter.description || ''],
              video: ['']
            });
            this.chapters.push(chapterGroup);
            this.videoFiles.push(null as any); // placeholder
          });
        },
        error: (err) => {
          console.error(err);
          this.errorMessage = "Impossible de charger la formation.";
        }
      });
    }
  }

  addChapter() {
    const chapterGroup = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      video: ['']
    });
    this.chapters.push(chapterGroup);
    this.videoFiles.push(null as any);
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

      if (this.selectedImage) {
        formData.append('image', this.selectedImage);
      }

      const chaptersMetadata = this.chapters.controls.map((chapter, i) => {
        const chapterData: any = {
          title: chapter.get('title')?.value,
          description: chapter.get('description')?.value || ''
        };
        if (this.videoFiles[i]) {
          chapterData.videoField = `video_chapter_${i}`;
          formData.append(chapterData.videoField, this.videoFiles[i]);
        }
        return chapterData;
      });

      formData.append('chapters', JSON.stringify(chaptersMetadata));

      const request = this.formationId
        ? this.pagesService.updateFormation(this.formationId, formData)
        : this.pagesService.addFormation(formData);

      request.subscribe({
        next: () => {
          this.successMessage = this.formationId
            ? 'Formation mise à jour avec succès !'
            : 'Formation ajoutée avec succès !';
          this.errorMessage = '';
          this.formationForm.reset();
          this.imagePreview = null;
          this.chapters.clear();
          this.videoFiles = [];
          this.router.navigate(['/admin/formations']); // rediriger vers la liste
        },
        error: (err) => {
          this.successMessage = '';
          this.errorMessage = 'Erreur lors de l’envoi.';
          console.error(err);
        }
      });
    } else {
      this.successMessage = '';
      this.errorMessage = 'Formulaire incomplet.';
    }
  }
}

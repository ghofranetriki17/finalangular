import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiService } from '../../core/services/api.service';
import { Collection } from '../../models/collection';

@Component({
  selector: 'app-collection-form',
  templateUrl: './collection-form.component.html',
  styleUrls: ['./collection-form.component.scss']
})
export class CollectionFormComponent implements OnInit {
  collectionForm: FormGroup;
  isEditMode = false;
  collectionId: number | null = null;
  loading = false;
  previewImages: string[] = [];
  existingImages: string[] = [];
  filesToUpload: File[] = [];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiService,
    private snackBar: MatSnackBar
  ) {
    this.collectionForm = this.fb.group({
      nom: ['', Validators.required],
      saison: ['', Validators.required],
      type: ['', Validators.required],
      description: [''],
      images: [[]]
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.collectionId = +params['id'];
        this.loadCollection(this.collectionId);
      }
    });
  }

  loadCollection(id: number): void {
    this.loading = true;
    this.apiService.getCollection(id).subscribe({
      next: (collection) => {
        this.collectionForm.patchValue(collection);
        if (collection.images) {
          this.existingImages = collection.images as string[];
          this.previewImages = this.existingImages.map(name => `assets/images/${name}`);
        }
        this.loading = false;
      },
      error: () => {
        this.snackBar.open('Erreur lors du chargement', 'Fermer', { duration: 3000 });
        this.loading = false;
      }
    });
  }

  onFileSelected(event: any): void {
    const files: FileList = event.target.files;
    if (files) {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        this.filesToUpload.push(file);
        this.existingImages.push(file.name);  // Only store the name

        // Preview using URL.createObjectURL
        const objectUrl = URL.createObjectURL(file);
        this.previewImages.push(objectUrl);

        // ✅ You must copy these files manually to `src/assets/images/`
      }
    }
  }

  removeImage(index: number): void {
    this.previewImages.splice(index, 1);
    this.existingImages.splice(index, 1);
    if (index >= this.existingImages.length) {
      this.filesToUpload.splice(index - this.existingImages.length, 1);
    }
  }

  onSubmit(): void {
    if (this.collectionForm.invalid) return;

    this.loading = true;
    const collectionData: Collection = {
      ...this.collectionForm.value,
      designerId: 1,
      dateCreation: new Date().toISOString(),
      images: [...this.existingImages]
    };

    const request = this.isEditMode && this.collectionId
      ? this.apiService.updateCollection({ ...collectionData, id: this.collectionId! })
      : this.apiService.createCollection(collectionData);

    request.subscribe({
      next: () => {
        this.snackBar.open('Collection enregistrée avec succès', 'Fermer', { duration: 3000 });
        this.router.navigate(['/designer/collections']);
      },
      error: () => {
        this.snackBar.open('Erreur lors de l’enregistrement', 'Fermer', { duration: 3000 });
        this.loading = false;
      }
    });
  }
}

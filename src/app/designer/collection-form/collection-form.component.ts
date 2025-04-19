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
          this.previewImages = [...this.existingImages];
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading collection', error);
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
        
        // Create preview
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.previewImages.push(e.target.result);
        };
        reader.readAsDataURL(file);
      }
    }
  }

  removeImage(index: number): void {
    // If it's an existing image (string), just remove from preview
    if (index < this.existingImages.length) {
      this.existingImages.splice(index, 1);
    } 
    // If it's a new upload (File), remove from both arrays
    else {
      const fileIndex = index - this.existingImages.length;
      this.filesToUpload.splice(fileIndex, 1);
    }
    this.previewImages.splice(index, 1);
  }

  onSubmit(): void {
    if (this.collectionForm.invalid) {
      return;
    }

    this.loading = true;
    const collectionData: Collection = {
      ...this.collectionForm.value,
      designerId: 1, // Replace with actual designer ID
      dateCreation: new Date().toISOString(),
      images: [...this.existingImages] // Start with existing images
    };

    // Create FormData if we have files to upload
    let formData: FormData | null = null;
    if (this.filesToUpload.length > 0) {
      formData = new FormData();
      formData.append('collection', JSON.stringify(collectionData));
      this.filesToUpload.forEach(file => {
        if (formData) {
          formData.append('images', file);
        }
      });
    }

    if (this.isEditMode && this.collectionId) {
      collectionData.id = this.collectionId;
      const request = formData ? 
        this.apiService.updateCollectionWithImages(this.collectionId, formData) : 
        this.apiService.updateCollection(collectionData);
      
      request.subscribe({
        next: () => {
          this.snackBar.open('Collection mise à jour avec succès', 'Fermer', { duration: 3000 });
          this.router.navigate(['/designer/collections']);
        },
        error: (error) => {
          console.error('Error updating collection', error);
          this.snackBar.open('Erreur lors de la mise à jour', 'Fermer', { duration: 3000 });
          this.loading = false;
        }
      });
    } else {
      const request = formData ? 
        this.apiService.createCollectionWithImages(formData) : 
        this.apiService.createCollection(collectionData);
      
      request.subscribe({
        next: () => {
          this.snackBar.open('Collection créée avec succès', 'Fermer', { duration: 3000 });
          this.router.navigate(['/designer/collections']);
        },
        error: (error) => {
          console.error('Error creating collection', error);
          this.snackBar.open('Erreur lors de la création', 'Fermer', { duration: 3000 });
          this.loading = false;
        }
      });
    }
  }
}
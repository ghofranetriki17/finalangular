// src/app/designer/collections/collection-form/collection-form.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiService } from 'src/app/core/services/api.service';
import { Collection } from 'src/app/models/collection';
import { AngularFireAuth } from '@angular/fire/compat/auth';

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
  loggedInDesignerId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiService,
    private snackBar: MatSnackBar,
    private afAuth: AngularFireAuth
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

    this.afAuth.authState.subscribe(user => {
      if (user?.uid) {
        this.apiService.getMembres().subscribe(membres => {
          const currentMembre = membres.find(m => m.uid === user.uid && m.role === 'designer');
          if (currentMembre) {
            this.loggedInDesignerId = currentMembre.id;
          }
        });
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

        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.previewImages.push(e.target.result);
        };
        reader.readAsDataURL(file);
      }
    }
  }

  removeImage(index: number): void {
    if (index < this.existingImages.length) {
      this.existingImages.splice(index, 1);
    } else {
      const fileIndex = index - this.existingImages.length;
      this.filesToUpload.splice(fileIndex, 1);
    }
    this.previewImages.splice(index, 1);
  }

  onSubmit(): void {
    if (this.collectionForm.invalid || !this.loggedInDesignerId) {
      this.snackBar.open('Veuillez remplir tous les champs obligatoires', 'Fermer', { duration: 3000 });
      return;
    }

    this.loading = true;
    const collectionData: Collection = {
      ...this.collectionForm.value,
      designerId: this.loggedInDesignerId,
      dateCreation: new Date().toISOString(),
      images: [...this.existingImages]
    };

    let formData: FormData | null = null;
    if (this.filesToUpload.length > 0) {
      formData = new FormData();
      formData.append('collection', JSON.stringify(collectionData));
      this.filesToUpload.forEach(file => {
        formData!.append('images', file);
      });
    }

    const request = this.isEditMode && this.collectionId ?
      (formData ?
        this.apiService.updateCollectionWithImages(this.collectionId, formData) :
        this.apiService.updateCollection({ ...collectionData, id: this.collectionId })
      ) :
      (formData ?
        this.apiService.createCollectionWithImages(formData) :
        this.apiService.createCollection(collectionData)
      );

    request.subscribe({
      next: () => {
        const msg = this.isEditMode ? 'mise à jour' : 'créée';
        this.snackBar.open(`Collection ${msg} avec succès`, 'Fermer', { duration: 3000 });
        this.router.navigate(['/designer/collections']);
      },
      error: (error) => {
        console.error('Erreur lors de la soumission', error);
        this.snackBar.open('Erreur lors de la soumission', 'Fermer', { duration: 3000 });
        this.loading = false;
      }
    });
  }
}

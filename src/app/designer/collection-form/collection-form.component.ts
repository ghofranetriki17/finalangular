import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiService } from '../../core/services/api.service';
import { Collection } from '../../models/collection';
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
          this.collectionForm.get('images')?.setValue(collection.images);
          this.previewImages = collection.images.map(name => `assets/images/${name}`);
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Erreur chargement collection', error);
        this.snackBar.open('Erreur lors du chargement', 'Fermer', { duration: 3000 });
        this.loading = false;
      }
    });
  }

  onFileSelected(event: any): void {
    const files: FileList = event.target.files;
    if (files) {
      const imagesArray = this.collectionForm.get('images')?.value || [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileName = file.name;

        imagesArray.push(fileName);
        this.previewImages.push(`assets/images/${fileName}`);
      }
      this.collectionForm.get('images')?.setValue(imagesArray);
    }
  }

  removeImage(index: number): void {
    this.previewImages.splice(index, 1);
    const images = this.collectionForm.get('images')?.value || [];
    images.splice(index, 1);
    this.collectionForm.get('images')?.setValue(images);
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
      dateCreation: new Date().toISOString()
    };

    const request = this.isEditMode && this.collectionId
      ? this.apiService.updateCollection({ ...collectionData, id: this.collectionId })
      : this.apiService.createCollection(collectionData);

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

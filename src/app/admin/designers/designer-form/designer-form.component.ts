import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from '../../../../environments/environment';
import { Designer } from '../../../models/designer';
import { Membre } from '../../../models/membre';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Component({
  selector: 'app-designer-form',
  templateUrl: './designer-form.component.html',
  styleUrls: ['./designer-form.component.scss']
})
export class DesignerFormComponent implements OnInit {
  designerForm!: FormGroup;
  isLoading = false;
  isEdit = false;
  designerId!: number;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private snackBar: MatSnackBar,
    private afAuth: AngularFireAuth
  ) {}

  ngOnInit(): void {
    this.initForm(); // Toujours initialiser le formulaire au début

    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEdit = true;
        this.designerId = +params['id'];
        this.loadDesigner(this.designerId); // Charger les données ensuite
      }
    });
  }

  initForm(): void {
    this.designerForm = this.fb.group({
      nom: ['', Validators.required],
      prenom: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      telephone: [''],
      specialite: ['', Validators.required],
      anneesExperience: [0, [Validators.required, Validators.min(0)]],
      password: ['', Validators.minLength(6)] // pas requis en édition
    });
  }

  loadDesigner(id: number): void {
    this.isLoading = true;
    this.http.get<Designer>(`${environment.apiUrl}/designers/${id}`).subscribe({
      next: (designer) => {
        this.http.get<Membre>(`${environment.apiUrl}/membres/${designer.membreId}`).subscribe({
          next: (membre) => {
            this.designerForm.patchValue({
              nom: membre.nom,
              prenom: membre.prenom,
              email: membre.email,
              telephone: membre.telephone,
              specialite: designer.specialite,
              anneesExperience: designer.anneesExperience
            });
            this.isLoading = false;
          },
          error: (err) => this.showError("Erreur chargement du membre", err)
        });
      },
      error: (err) => this.showError("Erreur chargement du designer", err)
    });
  }

  onSubmit(): void {
    if (this.designerForm.invalid) return;
    const formData = this.designerForm.value;
    this.isLoading = true;

    if (this.isEdit) {
      this.updateDesigner(formData);
    } else {
      this.createDesigner(formData);
    }
  }

  createDesigner(formData: any): void {
    this.afAuth.createUserWithEmailAndPassword(formData.email, formData.password)
      .then(credentials => {
        const uid = credentials.user?.uid;
        if (!uid) throw new Error('UID Firebase manquant');

        const membre: Partial<Membre> = {
          nom: formData.nom,
          prenom: formData.prenom,
          email: formData.email,
          telephone: formData.telephone,
          role: 'designer',
          dateInscription: new Date().toISOString(),
          uid
        };

        return this.http.post<Membre>(`${environment.apiUrl}/membres`, membre).toPromise();
      })
      .then((newMembre: any) => {
        const designer: Designer = {
          id: newMembre.id,
          membreId: newMembre.id,
          specialite: formData.specialite,
          anneesExperience: formData.anneesExperience
        };
        return this.http.post(`${environment.apiUrl}/designers`, designer).toPromise();
      })
      .then(() => {
        this.snackBar.open('Designer créé avec succès', 'Fermer', { duration: 3000 });
        this.router.navigate(['/admin/designers']);
      })
      .catch(err => this.showError("Erreur lors de la création du designer", err))
      .finally(() => this.isLoading = false);
  }

  updateDesigner(formData: any): void {
    this.http.get<Designer>(`${environment.apiUrl}/designers/${this.designerId}`).subscribe({
      next: (designer) => {
        const membreUpdate: Partial<Membre> = {
          nom: formData.nom,
          prenom: formData.prenom,
          email: formData.email,
          telephone: formData.telephone
        };

        this.http.patch(`${environment.apiUrl}/membres/${designer.membreId}`, membreUpdate).subscribe({
          next: () => {
            const designerUpdate: Partial<Designer> = {
              specialite: formData.specialite,
              anneesExperience: formData.anneesExperience
            };

            this.http.patch(`${environment.apiUrl}/designers/${this.designerId}`, designerUpdate).subscribe({
              next: () => {
                this.snackBar.open('Designer mis à jour avec succès', 'Fermer', { duration: 3000 });
                this.router.navigate(['/admin/designers']);
              },
              error: err => this.showError("Erreur update designer", err)
            });
          },
          error: err => this.showError("Erreur update membre", err)
        });
      },
      error: err => this.showError("Designer non trouvé", err)
    });
  }

  cancel(): void {
    this.router.navigate(['/admin/designers']);
  }

  private showError(message: string, error: any): void {
    console.error(message, error);
    this.snackBar.open(message, 'Fermer', { duration: 3000 });
    this.isLoading = false;
  }
}

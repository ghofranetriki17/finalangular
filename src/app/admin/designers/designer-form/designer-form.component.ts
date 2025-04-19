// src/app/admin/designers/designer-form/designer-form.component.ts
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
    this.initForm();
    
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEdit = true;
        this.designerId = +params['id'];
        this.loadDesigner(this.designerId);
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
      password: ['', this.isEdit ? [] : [Validators.required, Validators.minLength(6)]]
    });
  }

  loadDesigner(id: number): void {
    this.isLoading = true;
    
    this.http.get<Designer>(`${environment.apiUrl}/designers/${id}`).subscribe(
      (designer) => {
        this.http.get<Membre>(`${environment.apiUrl}/membres/${designer.membreId}`).subscribe(
          (membre) => {
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
          (error) => {
            console.error('Erreur lors de la récupération du membre:', error);
            this.snackBar.open('Erreur lors du chargement des données du designer', 'Fermer', { duration: 3000 });
            this.isLoading = false;
          }
        );
      },
      (error) => {
        console.error('Erreur lors de la récupération du designer:', error);
        this.snackBar.open('Erreur lors du chargement des données du designer', 'Fermer', { duration: 3000 });
        this.isLoading = false;
      }
    );
  }

  onSubmit(): void {
    if (this.designerForm.invalid) {
      return;
    }

    this.isLoading = true;
    const formData = this.designerForm.value;

    if (this.isEdit) {
      this.updateDesigner(formData);
    } else {
      this.createDesigner(formData);
    }
  }

  createDesigner(formData: any): void {
    // Créer un compte Firebase
    this.afAuth.createUserWithEmailAndPassword(formData.email, formData.password)
      .then(credentials => {
        if (credentials.user) {
          const uid = credentials.user.uid;
          
          // Créer le membre
          const membre: Membre = {
            nom: formData.nom,
            prenom: formData.prenom,
            email: formData.email,
            telephone: formData.telephone,
            role: 'designer',
            dateInscription: new Date().toISOString(),
            uid: uid,
            id: 0
          };
          
          this.http.post<Membre>(`${environment.apiUrl}/membres`, membre).subscribe(
            (newMembre) => {
              // Créer le designer
              const designer: Designer = {
                id: newMembre.id,
                membreId: newMembre.id,
                specialite: formData.specialite,
                anneesExperience: formData.anneesExperience
              };
              
              this.http.post<Designer>(`${environment.apiUrl}/designers`, designer).subscribe(
                () => {
                  this.snackBar.open('Designer créé avec succès', 'Fermer', { duration: 3000 });
                  this.router.navigate(['/admin/designers']);
                },
                (error) => {
                  console.error('Erreur lors de la création du designer:', error);
                  this.snackBar.open('Erreur lors de la création du designer', 'Fermer', { duration: 3000 });
                  this.isLoading = false;
                }
              );
            },
            (error) => {
              console.error('Erreur lors de la création du membre:', error);
              this.snackBar.open('Erreur lors de la création du membre', 'Fermer', { duration: 3000 });
              this.isLoading = false;
            }
          );
        }
      })
      .catch(error => {
        console.error('Erreur lors de la création du compte Firebase:', error);
        this.snackBar.open(`Erreur lors de la création du compte: ${error.message}`, 'Fermer', { duration: 3000 });
        this.isLoading = false;
      });
  }

  updateDesigner(formData: any): void {
    this.http.get<Designer>(`${environment.apiUrl}/designers/${this.designerId}`).subscribe(
      (designer) => {
        // Mettre à jour le membre
        const membre: Partial<Membre> = {
          nom: formData.nom,
          prenom: formData.prenom,
          email: formData.email,
          telephone: formData.telephone
        };
        
        this.http.patch(`${environment.apiUrl}/membres/${designer.membreId}`, membre).subscribe(
          () => {
            // Mettre à jour le designer
            const updatedDesigner: Partial<Designer> = {
              specialite: formData.specialite,
              anneesExperience: formData.anneesExperience
            };
            
            this.http.patch(`${environment.apiUrl}/designers/${this.designerId}`, updatedDesigner).subscribe(
              () => {
                this.snackBar.open('Designer mis à jour avec succès', 'Fermer', { duration: 3000 });
                this.router.navigate(['/admin/designers']);
              },
              (error) => {
                console.error('Erreur lors de la mise à jour du designer:', error);
                this.snackBar.open('Erreur lors de la mise à jour du designer', 'Fermer', { duration: 3000 });
                this.isLoading = false;
              }
            );
          },
          (error) => {
            console.error('Erreur lors de la mise à jour du membre:', error);
            this.snackBar.open('Erreur lors de la mise à jour du membre', 'Fermer', { duration: 3000 });
            this.isLoading = false;
          }
        );
      },
      (error) => {
        console.error('Erreur lors de la récupération du designer:', error);
        this.snackBar.open('Erreur lors de la mise à jour du designer', 'Fermer', { duration: 3000 });
        this.isLoading = false;
      }
    );
  }

  cancel(): void {
    this.router.navigate(['/admin/designers']);
  }
}
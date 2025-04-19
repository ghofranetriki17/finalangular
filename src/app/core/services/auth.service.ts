// src/app/core/services/auth.service.ts
import { Inject, Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { HttpClient } from '@angular/common/http';
import { Observable, from, of, throwError } from 'rxjs';
import { switchMap, map, catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Membre } from '../../models/membre';
import { Designer } from '../../models/designer';
import { Stagiaire } from '../../models/stagiaire';
import firebase from 'firebase/compat/app';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(
    @Inject(AngularFireAuth) private afAuth: AngularFireAuth,
    private http: HttpClient
  ) {}

  login(email: string, password: string): Observable<Membre> {
    return from(this.afAuth.signInWithEmailAndPassword(email, password)).pipe(
      switchMap((credentials: firebase.auth.UserCredential) => {
        if (credentials.user) {
          return this.getUserByUid(credentials.user.uid).pipe(
            switchMap(membre => {
              if (membre) {
                return of(membre);
              }
              return throwError(() => new Error('Utilisateur non trouvé dans la base de données'));
            })
          );
        }
        return throwError(() => new Error('Authentification échouée'));
      })
    );
  }

  getUserByUid(uid: string): Observable<Membre | null> {
    return this.http.get<Membre[]>(`${environment.apiUrl}/membres?uid=${uid}`).pipe(
      map(membres => membres.length > 0 ? membres[0] : null)
    );
  }

  getDesignerByMembreId(membreId: number): Observable<Designer | null> {
    return this.http.get<Designer[]>(`${environment.apiUrl}/designers?membreId=${membreId}`).pipe(
      map(designers => designers.length > 0 ? designers[0] : null)
    );
  }

  getStagiaireByMembreId(membreId: number): Observable<Stagiaire | null> {
    return this.http.get<Stagiaire[]>(`${environment.apiUrl}/stagiaires?membreId=${membreId}`).pipe(
      map(stagiaires => stagiaires.length > 0 ? stagiaires[0] : null)
    );
  }

  logout(): Observable<void> {
    return from(this.afAuth.signOut());
  }

  get currentUser(): Observable<firebase.User | null> {
    return this.afAuth.authState;
  }

  getCurrentMembre(): Observable<Membre | null> {
    return this.currentUser.pipe(
      switchMap(user => {
        if (user) {
          return this.getUserByUid(user.uid);
        }
        return of(null);
      })
    );
  }

  isLoggedIn(): Observable<boolean> {
    return this.currentUser.pipe(
      map(user => !!user)
    );
  }

  hasRole(role: 'admin' | 'designer' | 'stagiaire' | 'client'): Observable<boolean> {
    return this.currentUser.pipe(
      switchMap(user => {
        if (user) {
          return this.getUserByUid(user.uid).pipe(
            map(membre => !!membre && membre.role === role)
          );
        }
        return of(false);
      })
    );
  }

  register(email: string, password: string, membre: Partial<Membre>): Observable<Membre> {
    return from(this.afAuth.createUserWithEmailAndPassword(email, password)).pipe(
      switchMap((credentials: firebase.auth.UserCredential) => {
        if (credentials.user) {
          const newMembre: Membre = {
            ...membre as Membre,
            email,
            uid: credentials.user.uid,
            dateInscription: new Date().toISOString(),
            role: membre.role || 'client',
            id: 0 // Will be assigned by the server
          };
          
          return this.http.post<Membre>(`${environment.apiUrl}/membres`, newMembre);
        }
        return throwError(() => new Error('Échec de la création du compte'));
      })
    );
  }
}
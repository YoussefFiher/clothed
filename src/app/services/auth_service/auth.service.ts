import { Injectable } from '@angular/core';
import { UserService } from '../user/user.service';
import { User } from '../../models/user.model';
import { Observable, BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import * as bcrypt from 'bcryptjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<User | null> = new BehaviorSubject<User | null>(null);
  currentUserObservable: Observable<User | null> = this.currentUserSubject.asObservable();
  isAuth: boolean = false;
  ShowSigninButton: boolean = false;

  constructor(private userService: UserService, private http: HttpClient) {
    this.isAuth = false;
    this.currentUserObservable.subscribe((user) => {
       // this.currentUser = user;
    });
  }

  get currentUser(): User | null {
    return this.currentUserSubject.value;
  }

  /*
    Description: Récupère les informations de l'administrateur depuis le serveur.
    ----------------------------------------------------------------------------------------------------------------------------
    Paramètres : Aucun
    ----------------------------------------------------------------------------------------------------------------------------
    Retour : Un Observable contenant les informations de l'administrateur.
  */
  getadmin(): Observable<User> {
    return this.http.get<User>(`${'http://localhost:5000/admin'}`);
  }



  set currentUser(user: User | null) {
    this.currentUserSubject.next(user);
  }

  /*
    Description: Récupère la liste des utilisateurs depuis le serveur.
    ----------------------------------------------------------------------------------------------------------------------------
    Paramètres : Aucun
    ----------------------------------------------------------------------------------------------------------------------------
    Retour : Un Observable contenant la liste des utilisateurs.
  */
  getusers(): Observable<User[]> {
    return this.http.get<User[]>(`${'http://localhost:5000/api/users'}`);
  }

  /*
    Description: Authentifie l'utilisateur en vérifiant l'e-mail et le mot de passe.
    ----------------------------------------------------------------------------------------------------------------------------
    Paramètres : 
      - email: L'adresse e-mail de l'utilisateur.
      - password: Le mot de passe de l'utilisateur.
    ----------------------------------------------------------------------------------------------------------------------------
    Retour : Une promesse résolue si l'authentification est réussie, rejetée avec un message d'erreur sinon.
  */
  signIn(email: string, password: string) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        this.userService.getUserByEmail(email).subscribe({
          next: async (user: User | null) => {
            if (user) {
              if (!user.isConfirmed) {
                reject("Votre adresse e-mail n'est pas confirmée.");
                return;
              }
  
              const passwordMatch = await bcrypt.compare(password, user.password);
  
              if (passwordMatch) {
                this.isAuth = true;
                this.currentUser = user;
                console.log(this.currentUser);
                console.log(this.currentUser?.firstName);
                resolve(true);
              } else {
                reject("Le mot de passe ne correspond pas.");
              }
            } else {
              reject("L'adresse email n'existe pas.");
            }
          },
          error: (error: any) => {
            console.error("Erreur lors de la récupération de l'utilisateur:", error);
            reject("L'adresse email n'existe pas.");
          }
        });
      }, 50);
    });
  }
  
  
  signOut() {
    this.isAuth = false;
    this.currentUser = null;
  }

  
   // Met à jour les informations de l'utilisateur sur le serveur.
  updateUserInfo(userId: number, updatedUser: any, options: any) {
    return this.http.put(`/api/update-user/${userId}`, updatedUser, options);
  }
  // Google OAuth auto-login
  signInWithGoogle(googleInfo: any): Promise<void> {
    return new Promise((resolve, reject) => {
      const { email, given_name, family_name, picture } = googleInfo;
      // Check if user exists
      this.http.get(`http://localhost:5000/api/check-email/${email}`).subscribe({
        next: (res: any) => {
          if (res.exists) {
            // User exists → sign in
            this.http.get(`http://localhost:5000/api/${email}`).subscribe({
              next: (user: any) => {
                if (user && user.isConfirmed) {
                  this.currentUser = user;
                  localStorage.setItem('currentUser', JSON.stringify(user));
                  resolve();
                } else {
                  reject('Compte non confirmé.');
                }
              },
              error: () => reject('Erreur connexion.'),
            });
          } else {
            // New user → auto-register
            const code = Math.random().toString(36).substring(2, 8).toUpperCase();
            const payload = {
              firstname: given_name || 'Utilisateur',
              lastname:  family_name || 'Google',
              email,
              password:  Math.random().toString(36).slice(2) + '!Aa1',
              ville:     '',
              address:   '',
              pdp:       picture || '',
              confirmcode: code,
              isConfirmed: true,
            };
            this.http.post('http://localhost:5000/api/signup', payload).subscribe({
              next: (r: any) => {
                if (r.success) {
                  this.currentUser = r.user;
                  localStorage.setItem('currentUser', JSON.stringify(r.user));
                  resolve();
                } else {
                  reject("Erreur création compte.");
                }
              },
              error: () => reject('Erreur inscription Google.'),
            });
          }
        },
        error: () => reject('Erreur serveur.'),
      });
    });
  }

}

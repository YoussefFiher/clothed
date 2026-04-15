import { Injectable } from '@angular/core';
import { User} from '../../models/user.model';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiUrl = 'http://localhost:5000/api/users';
  

  constructor(private http : HttpClient) {
    
  }
  //Obtient le prénom d'un utilisateur par son ID.
  getUsernameById(userId: number): Observable<string> {
    return this. getUserByID(userId).pipe(
      map( user=> user ? user.firstName : 'Utilisateur inconnu')
    );
  }
  
  //Obtient un utilisateur par son adresse e-mail.
  getUserByEmail(searchedEmail: string): Observable<User | null> {
    return this.http.get<User>(`${'http://localhost:5000/api'}/${searchedEmail}`);
  }
  
  
  //Obtient un utilisateur par son ID.
  getUserByID(searchedID: number): Observable<User | null> {
    return this.http.get<User>(`${this.apiUrl}/${searchedID}`);
  }


  /*
    Description: Ajoute un nouvel utilisateur.
    ----------------------------------------------------------------------------------------------------------------------------
    Paramètres : 
      - user: Les données de l'utilisateur à ajouter.
    ----------------------------------------------------------------------------------------------------------------------------
    Retour : Un Observable contenant la réponse du serveur.
  */

  addUser(user: User): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/signup`, user);
  }

  //Récupère tous les utilisateurs.
  getusers(): Observable<User[]> {
    return this.http.get<User[]>(`${'http://localhost:5000/users'}`);
  }

  /*
    Description: Bloque un utilisateur.
    ----------------------------------------------------------------------------------------------------------------------------
    Paramètres : 
      - user: L'utilisateur à bloquer.
    ----------------------------------------------------------------------------------------------------------------------------
    Retour : Un Observable contenant l'utilisateur bloqué.
  */
  blockUser(user: User): Observable<User> {
    return this.http.post<any>(`${this.apiUrl}/delete`, user);
}

}


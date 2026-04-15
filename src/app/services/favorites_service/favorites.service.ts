import { Injectable } from '@angular/core';
import { Article } from 'src/app/models/articles.model';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../auth_service/auth.service';

@Injectable({
  providedIn: 'root'
})
export class FavoritesService {
  nblikes : number = 0;
  private apiUrl = 'http://localhost:5000';  
  

private favoritesArticles : Map<number, Article> = new Map<number, Article>();

constructor(private http : HttpClient, private authService : AuthService) {

}
/*
    Description: Ajoute un article aux favoris d'un utilisateur.
    ----------------------------------------------------------------------------------------------------------------------------
    Paramètres : 
      - article: L'article à ajouter aux favoris.
      - userId: L'identifiant de l'utilisateur.
    ----------------------------------------------------------------------------------------------------------------------------
    Retour : Un Observable contenant la réponse de la requête d'ajout aux favoris.
  */
addToFavorites(article: Article, userId: number): Observable<any> {
  return this.http.post(`${this.apiUrl}/addfavorite`, { articleId: article.id, userId });
}

/*
    Description: Supprime un article des favoris d'un utilisateur.
    ----------------------------------------------------------------------------------------------------------------------------
    Paramètres : 
      - article: L'article à supprimer des favoris.
      - userId: L'identifiant de l'utilisateur.
    ----------------------------------------------------------------------------------------------------------------------------
    Retour : Un Observable contenant la réponse de la requête de suppression des favoris.
  */
removeFromFavorites(article: Article, userId: number): Observable<any> {
  return this.http.post(`${this.apiUrl}/addfavorite`, { articleId: article.id, userId });
}


 /*
    Description: Récupère la liste des favoris de l'utilisateur connecté.
    ----------------------------------------------------------------------------------------------------------------------------
    Paramètres : Aucun
    ----------------------------------------------------------------------------------------------------------------------------
    Retour : Un Observable contenant la liste des favoris.
  */
getFavorites(): Observable<any[]> {
  return this.http.get<any[]>(`${this.apiUrl}/favorite`);
}

}



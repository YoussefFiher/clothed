import { Injectable, OnInit } from '@angular/core';
import { Article } from 'src/app/models/articles.model';
import { UserService } from '../user/user.service';
import { Observable, forkJoin, Subject  } from 'rxjs';
import { AuthService } from '../auth_service/auth.service';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class ArticleService {
  private apiUrl = 'http://localhost:5000/article';
  public articles: Article[] = [];
  nextid : number = 0;
  private articleSubmittedSubject: Subject<void> = new Subject<void>();
  
  constructor(private userService: UserService,private authService: AuthService,private http : HttpClient) {
    
  }

  /*
    Description: Ajoute un nouvel article.
    ----------------------------------------------------------------------------------------------------------------------------
    Paramètres : 
      - article: L'article à ajouter.
    ----------------------------------------------------------------------------------------------------------------------------
    Retour : Aucun
  */

  addArticle(article: Article): void {
    if (article.images && article.images.length > 0) {
      const images: string[] = [];
  
  
      for (let i = 0; i < article.images.length; i++) {
        if (typeof article.images[i] === 'string') {
          images.push(article.images[i] as string);
        } else if (article.images[i] instanceof File) {
          const reader = new FileReader();
          reader.onload = (e) => {
            const imageUrl = e.target?.result as string;
            images.push(imageUrl);
  
            if (images.length === article.images.length) {
              article.images = images;
              this.articles.push(article);
            }
          };
          reader.readAsDataURL(article.images[i] as File);
        }
      } console.log(images)
    } else {
      this.articles.push(article);
    }
  }
  
  //Récupère tous les articles depuis le serveur.
  getArticles(): Observable<Article[]> {
    return this.http.get<Article[]>(this.apiUrl);
  
  }
  
  
  // Filtre les articles par catégorie.
  filterArticles(category:string) {
    return this.articles.filter(article => article.type === category)
  }

  //Récupère un article par son identifiant depuis le serveur.
  getArticleById(id: number): Observable<Article> {
    return this.http.get<Article>(`${this.apiUrl}/${id}`)
}
  

  //Récupère plusieurs articles par leurs identifiants depuis le serveur.
  getArticlesByIds(articleIds: number[]): Observable<Article[]> {
    const requests: Observable<Article>[] = [];
  
    
    articleIds.forEach((id) => {
      requests.push(this.getArticleById(id));
    });
  
    
    return forkJoin(requests);
  }

  //Supprime un article depuis le serveur.
  deleteArticle(articleId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/delete-article/${articleId}`, {});
  }

  getArticlesByUserId(userId: number): Observable<Article[]> {

    return this.http.get<Article[]>(`${this.apiUrl}/user/${userId}`);
  }

  //Met à jour le statut d'un article spécifié depuis le serveur.
  updateArticleStatus(articleId: number, newStatus: string): Observable<any> {
    const url = `${this.apiUrl}/updateArticleStatus/${articleId}`;
    return this.http.post(url, { newStatus });
  }

  getArticleSubmittedSubject(): Observable<void> {
    return this.articleSubmittedSubject.asObservable();
  }

  // Émet un événement pour notifier la soumission d'un article.
  emitArticleSubmitted() {
    this.articleSubmittedSubject.next();
  }

}





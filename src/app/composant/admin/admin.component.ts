import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user/user.service';
import { User} from 'src/app/models/user.model';
import { Article} from 'src/app/models/articles.model';
import { ArticleService} from 'src/app/services/article_service/article.service';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { DeleteconfirmationComponent } from '../deleteconfirmation/deleteconfirmation.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  users : User[] = [];
  usersFiltered: User[] = [];
  articlesfiltered: Article[] = [] ;
  usersnumber : number = 0;
  articlesnumber : number = 0;
  articles : Article[] = [];
  showUsers: boolean = true; 
  showArticles: boolean = false; 
  searchTerm: string = '';

  constructor(private userService: UserService, private articleService: ArticleService, public dialog : MatDialog, private router: Router){
    
  }
  ngOnInit(): void {
    this.refreshUsersList();
    this.refreshArticleList();

    
  }

  /*
  Description: chargment de tous les utilisateurs qui sont identifiées dans la plateforme.
  ----------------------------------------------------------------------------------------------------------------------------
  Paramètres : Aucun
  ----------------------------------------------------------------------------------------------------------------------------
  Retour : Aucun
*/
  refreshUsersList() {
    this.userService.getusers().subscribe({
      next: (users: User[]) => {
        
        //assertion
        console.assert(users !== undefined,"la  liste des utilisateurs doit être defini")

        this.users = users;
        this.usersFiltered = [...this.users];
        this.usersnumber = this.users.length;
      }
    });
  }

  //redirection vers le profil de l'utilisateur concerné
  navigateToDonateurProfile(userId:number) {
    this.router.navigate(['profil',userId]);
  }
  
/*
  Description: chargment de tous les articles ajoutés par les utilisateurs .
  ----------------------------------------------------------------------------------------------------------------------------
  Paramètres : Aucun
  ----------------------------------------------------------------------------------------------------------------------------
  Retour : Aucun
*/
  refreshArticleList() {
    this.articleService.getArticles().subscribe({
      next:(articles : Article[]) =>{

        //assertion
        console.assert(articles !== undefined,"la liste des articles doit être defini")

        this.articles = articles;
        this.articlesfiltered = [...this.articles]
        this.articlesnumber = this.articles.length
        console.log("les articles sont chargés")}
    })
  }

  // recuperer la 1ér image de la liste des images dans chaque articles ajoutés par les utilisateurs

  

  /*
  Description: Ouvre une boîte de dialogue de confirmation de suppression d'utilisateur.
  ----------------------------------------------------------------------------------------------------------------------------
  Paramètres : 
    - user: L'utilisateur à supprimer.
  ----------------------------------------------------------------------------------------------------------------------------
  Retour : Aucun
*/

openDeleteConfirmationDialog(user: User): void {
    const dialogRef = this.dialog.open(DeleteconfirmationComponent, {
      data: { user },  
    });
  
    dialogRef.afterClosed().subscribe(result => {

      //assertion
      console.assert(result,"l'utilisateur concerné doit  être supprimé")

      if (result) {
       
        this.onClickBlock(user);
      } else {

        console.log("Suppression annulée");
      }
    });
  }

  /*
  Description: Supprime un article en envoyant une requête de suppression au service d'articles.
              Rafraîchit ensuite la liste des articles.
  ----------------------------------------------------------------------------------------------------------------------------
  Paramètres :
    - article: L'article à supprimer.
  ----------------------------------------------------------------------------------------------------------------------------
  Retour : Aucun
*/

onClickDeleteArticle(article: any): void {
    const articleId = article.id;

    //assertion
    console.assert(articleId !== null,"l'article qu'on veut supprimé doit être defini")

    this.articleService.deleteArticle(articleId).subscribe({
      next: (response: any) => {
        //assertion
        console.assert(response)
  

        this.refreshArticleList();
      },
      error: (error: any) => {
        console.error('Erreur lors de la suppression de l\'article', error);
      },
    });
  }

  /*
  Description: Ouvre une boîte de dialogue de confirmation de suppression d'article.
              Lorsque la boîte de dialogue se ferme, vérifie le résultat.
              Si l'utilisateur confirme la suppression, appelle la fonction pour supprimer l'article.
  ----------------------------------------------------------------------------------------------------------------------------
  Paramètres :
    - article: L'article à supprimer.
  ----------------------------------------------------------------------------------------------------------------------------
  Retour : Aucun
*/
openDeleteConfirmationDialogarticle(article: Article): void {
    const dialogRef = this.dialog.open(DeleteconfirmationComponent, {
      data: { article },  
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
       
        this.onClickDeleteArticle(article);
      } else {

        console.log("Suppression annulée");
      }
    });
  }

/*
  Description: Bloque un utilisateur en envoyant une requête au service utilisateur.
              Rafraîchit ensuite la liste des utilisateurs.
  ----------------------------------------------------------------------------------------------------------------------------
  Paramètres :
    - user: L'utilisateur à bloquer.
  ----------------------------------------------------------------------------------------------------------------------------
  Retour : Aucun
*/

onClickBlock(user: User): void {
  this.userService.blockUser(user).subscribe({
    next: (blockedUser: User) => {
      console.log(`Utilisateur bloqué`);
      this.refreshUsersList();
      
    },
    error: (error) => {
      console.error('Erreur lors du blocage de l\'utilisateur', error);
    }
  });
}

/*
  Description: Applique un filtre de recherche sur la liste d'utilisateurs ou d'articles en fonction de l'onglet actif.
  ----------------------------------------------------------------------------------------------------------------------------
  Paramètres :
    - searchTerm: Terme de recherche à appliquer.
  ----------------------------------------------------------------------------------------------------------------------------
  Retour : Aucun
*/

  applySearchFilter(searchTerm:any) {
    if (this.showUsers) {
      this.usersFiltered =this.users.filter(user =>
          (user.firstName + ' ' + user.lastName).toLowerCase().includes(searchTerm.toLowerCase())
        )
    console.log("les users filtrés",this.usersFiltered)
    } else if (this.showArticles) {
      this.articlesfiltered=this.articles.filter(article => article.title.toLowerCase().includes(searchTerm.toLowerCase())||
      article.type.toLowerCase().includes(searchTerm.toLowerCase()))
    }
  }

  avatarColor(id: number): string {
    const colors = ['#16a34a','#2563eb','#7c3aed','#d97706','#dc2626','#0891b2'];
    return colors[id % colors.length];
  }

  GetFirstImageUrl(article: any): string | null {
    const f = article.images?.[0];
    if (!f || typeof f !== 'string') return null;
    if (f.startsWith('http') || f.startsWith('data:')) return f;
    return '/assets/' + f;
  }
  getLibreCount(): number {
    return this.articles.filter(a => a.statut === 'libre').length;
  }

  getDoneCount(): number {
    return this.articles.filter(a => a.statut === 'donne' || a.statut === 'donne').length;
  }

  navigateToArticle(id: number): void {
    this.router.navigate(['article', id]);
  }
}

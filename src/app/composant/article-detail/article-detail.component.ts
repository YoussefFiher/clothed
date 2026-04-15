import { Component, OnInit } from '@angular/core';
import { Article } from 'src/app/models/articles.model';
import { ArticleService } from 'src/app/services/article_service/article.service';
import { ActivatedRoute } from '@angular/router';
import { NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from 'src/app/services/auth_service/auth.service';
import { FavoritesService } from 'src/app/services/favorites_service/favorites.service';
import { FormBuilder,FormGroup,Validators } from '@angular/forms';
import { MessageService } from 'src/app/services/message_service/message.service';
import { MatDialog} from '@angular/material/dialog';
import { MessageDialogComponent } from '../message-dialog/message-dialog.component';
import { MessageDomDialogComponent } from '../message-dom-dialog/message-dom-dialog.component';
import { User } from 'src/app/models/user.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-article-detail',
  templateUrl: './article-detail.component.html',
  styleUrls: ['./article-detail.component.css']
})
export class ArticleDetailComponent implements OnInit {
  messageFormVisible: boolean = false;
  article: Article | undefined;
  currentIndex: number = 0;
  private interval: any; 
  carouselDirection: string = 'left'; 
  isFavorite : boolean = false;
  favorites :any[] = []
  demande : boolean = false;
  messageForm :FormGroup;
  requestForm: FormGroup;
  admin : User | undefined;
  adminId : number | undefined;
  currentuserId : number | undefined;

  constructor(private articleService: ArticleService, private route: ActivatedRoute, config: NgbCarouselConfig,
     private authService: AuthService, 
     private favoriteService: FavoritesService, 
     private fb: FormBuilder,
     private messageService: MessageService,
     public dialog: MatDialog) {

    config.showNavigationArrows = true;
    config.showNavigationIndicators = true;
    //formulaire  d'envoyer un message
    this.messageForm = this.fb.group({
      content: ['', Validators.required]
      
   })

   //formulaire d'envoyer un message on cliquant sur demander l'article a votre domicile ou 
   // on cliquant sur demander l'article a une ASBL 
   this.requestForm = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    address: ['', Validators.required],
    asblName: [''], 
    asblAddress: [''],
  });
  }


  ngOnInit(): void {
    // requete pour recuperer l'admin pour que si un utilisateur veut signalet un article il peut signaler
    this.getadminID().subscribe({
      next: (adminId: number) => {
        this.adminId = adminId;

        //assertion
        console.assert(this.admin !== null , "l'admin dois exister")

        const articleId = Number(this.route.snapshot.paramMap.get('id'));
        //chargement de l'article
        this.loadArticle(articleId);
        this.loadFavorites();
        //assertion
        console.assert(this.currentuserId !== null , "l'utilisateur qui est connecté ne doit pas être null")
        this.currentuserId = this.authService.currentUser?.id

       
      },
      error: (error) => {
        console.error('Erreur lors de la récupération de l\'ID de l\'administrateur:', error);
      }
    });
  }
 /*
  Description: Récupère l'identifiant de l'administrateur à partir du service d'authentification.
  ----------------------------------------------------------------------------------------------------------------------------
  Paramètres : Aucun
  ----------------------------------------------------------------------------------------------------------------------------
  Retour : Un observable émettant l'identifiant de l'administrateur.
*/

  getadminID(): Observable<number> {
    return new Observable<number>((observer) => {
      this.authService.getadmin().subscribe({
        next: (admin: User) => {
          //assertion
          console.log(admin !== null);

          observer.next(admin.id);
          observer.complete();
        },
        error: (error) => {
          observer.error(error);
        }
      });
    });
  }

 /*
  Description: Gère l'ajout ou la suppression d'un article dans les favoris de l'utilisateur connecté.
  ----------------------------------------------------------------------------------------------------------------------------
  Paramètres : 
    - article: L'article pour lequel l'utilisateur clique sur le bouton favori.
  ----------------------------------------------------------------------------------------------------------------------------
  Retour : Aucun
*/
  onHeartClick(article: Article): void {
    const userId = this.authService.currentUser?.id;
    
    //assertion
    console.assert(userId!=null,"l'utilisateur connecté ne doit pas être null")


    if (userId) {
      if (this.isFavorite) {
        
        this.favoriteService.removeFromFavorites(article, userId).subscribe({
          next: (response) => {

            //assertion
            console.assert(response);

            this.isFavorite = false;
          },
          error: (error) => {
            console.error('Erreur lors de la suppression des favoris', error);
          }
        });
      } else {
        
        this.favoriteService.addToFavorites(article, userId).subscribe({
          next: (response) => {
            console.log(response);

            //assertion
            console.assert(response);
            this.isFavorite = true;
          },
          error: (error) => {
            console.error('Erreur lors de l\'ajout aux favoris', error);
          }
        });
      }
    } else {
      console.error('Utilisateur non connecté');
      
    }
  }

  /*
  Description: Gère l'ajout ou la suppression d'un article dans les favoris de l'utilisateur connecté.
  ----------------------------------------------------------------------------------------------------------------------------
  Paramètres : 
    - article: L'article pour lequel l'utilisateur clique sur le bouton favori.
  ----------------------------------------------------------------------------------------------------------------------------
  Retour : Aucun
*/
  loadFavorites() {
    const articleId = Number(this.route.snapshot.paramMap.get('id'));


    this.favoriteService.getFavorites().subscribe({
      next: (favorites: any[]) => {
        this.favorites = favorites;
        
        this.isFavorite = this.favorites.some(fav => fav.articleId === articleId);
      },
      error: (error) => {
        console.error('Erreur lors de la récupération des favoris', error);
      }
    });
  }

 


/*
  Description: Charge la liste des favoris de l'utilisateur connecté et vérifie si l'article actuellement affiché est dans ses favoris.
  ----------------------------------------------------------------------------------------------------------------------------
  Paramètres : Aucun
  ----------------------------------------------------------------------------------------------------------------------------
  Retour : Aucun
*/
  private loadArticle(articleId: number): void {
    this.articleService.getArticleById(articleId).subscribe({
      next: (result) => {

        //assertion
        
        this.article = result;
   
      },
      error: (error) => {
        console.error('Erreur lors du chargement de l\'article :', error);
      }
    });
  }

  //passer a l'image précédente
  prevImage(): void {

    //assertion
    console.assert(this.article !== null)

    if (this.article) {
      
      this.currentIndex = (this.currentIndex - 1 + this.article.images.length) % this.article.images.length;
    }
    this.carouselDirection = 'right'; 
  }

  //passer à l'image suivante
  nextImage(): void {

    //assertion
    console.assert(this.article!== null)

    if (this.article) {
      this.currentIndex = (this.currentIndex + 1) % this.article.images.length;
    }
    this.carouselDirection = 'left'; 
  }

 
/*
  Description: Ouvre une boîte de dialogue de message  ovec l'utilisateur propriétaire de l'article, en fonction du type de demande.
              et si le type de request et signaler  une boite de dialogue sera ouverte avec l'administrateur
  ----------------------------------------------------------------------------------------------------------------------------
  Paramètres : 
    - requestType: Le type de demande, tel que 'signaler' ou 'contacter'.
  ----------------------------------------------------------------------------------------------------------------------------
  Retour : Aucun
*/
  openMessageDialog(requestType: string): void {
    if (requestType === 'signaler') {
      if (this.adminId) {
        const dialogRef = this.dialog.open(MessageDialogComponent, {
          width: '550px',
          data: {
            receiverName: 'Administrateur',
            receiverId: this.adminId,
            requestType: requestType,
            articleId: this.article?.id,
            article: this.article
          },
        });

        dialogRef.afterClosed().subscribe(result => {
          console.log('Le dialogue a été fermé', result);
          if (result && result.demandeEnvoyee) {
            this.demande = true;
          }
        });
      }
    } else {
      const dialogRef = this.dialog.open(MessageDialogComponent, {
        width: '550px',
        data: {
          receiverName: this.article?.user.firstName,
          receiverId: this.article?.user.id,
          articleId: this.article?.id,
          requestType: requestType,
          article : this.article
        },
      });
      dialogRef.afterClosed().subscribe(result => {

        //assertion
        console.assert(result !== undefined, "Le résultat de la boîte de dialogue doit être défini après sa fermeture");

        if (result && result.demandeEnvoyee) {
          this.demande = true;
        }
      });
    }
  }
  

 // envoi de message au propriétaire de l'article
  contacter(): void {
  
    const senderId = this.authService.currentUser?.id;
    const receiverId = this.article?.user.id;

    if (senderId && receiverId) {
      
      this.messageForm.reset(); 
      this.messageForm.patchValue({
      receiverId: receiverId,
       
      }); 

      this.openMessageDialog('contacter')
    }
  }
  //envoie de massage a l'administrateur
  signaler(): void {
    const senderId = this.authService.currentUser?.id;
    const receiverId = this.adminId
    //assertion
    console.assert(senderId!==null && receiverId!==null,"l'expéditeur et le destinataire ne doivent pas être null")
    if (senderId && receiverId) {
      this.messageForm.reset();
      this.messageForm.patchValue({
        receiverId: receiverId,
        content: 'Message de signalement pour l\'administrateur'
      });
      this.openMessageDialog('signaler');
    }
  }
  
 // Ouvre une boîte de dialogue de message DOM avec l'utilisateur propriétaire de l'article.
//Cette fonction est utilisée pour initier un dialogue DOM avec l'utilisateur, affichant une boîte de dialogue personnalisée
  openMessageDomDialog(requestType: string): void {
    const dialogRef = this.dialog.open(MessageDomDialogComponent, {
      width: '550px',
      data: {
        receiverName: this.article?.user.firstName,
        receiverPdp: this.article?.user.pdp,
        receiverId: this.article?.user.id,
        articleId: this.article?.id,
        requestType: requestType,
      },
    });
  
    dialogRef.afterClosed().subscribe(result => {

      console.assert(result !== undefined, "Le résultat de la boîte de dialogue doit être défini après sa fermeture");
      if (result && result.demandeEnvoyee) {
        this.demande = true;
      }
    });
  }
  
  
  /*
  Description: Initialise une demande de message à domicile entre l'utilisateur connecté et le propriétaire de l'article.
              Cette fonction réinitialise le formulaire de message, définit l'identifiant du destinataire dans le formulaire, puis ouvre une boîte de dialogue de message DOM.
  ----------------------------------------------------------------------------------------------------------------------------
  Paramètres : Aucun
  ----------------------------------------------------------------------------------------------------------------------------
  Retour : Aucun
*/
 homerequest(): void {
    const senderId = this.authService.currentUser?.id;
    const receiverId = this.article?.user.id;
  
    console.assert(senderId !== null,receiverId !== null , "l'expediteur et le destinataire doivent être défini");
    if (senderId && receiverId) {
      this.messageForm.reset();
      this.messageForm.patchValue({
        receiverId: receiverId,
      });
  
      this.openMessageDomDialog('domicile'); 
    }
  }
  
  /*
  Description: Initialise une demande de message à l'ASBL entre l'utilisateur connecté et le propriétaire de l'article.
              Cette fonction réinitialise le formulaire de message, définit l'identifiant du destinataire dans le formulaire, puis ouvre une boîte de dialogue de message DOM.
  ----------------------------------------------------------------------------------------------------------------------------
  Paramètres : Aucun
  ----------------------------------------------------------------------------------------------------------------------------
  Retour : Aucun
*/
  asblrequest(): void {
    const senderId = this.authService.currentUser?.id;
    const receiverId = this.article?.user.id;
  
    console.assert(senderId !== null,receiverId !== null , "l'expediteur et le destinataire doivent être défini");
    if (senderId && receiverId) {
      this.messageForm.reset();
      this.messageForm.patchValue({
        receiverId: receiverId,
      });
  
      this.openMessageDomDialog('asbl'); 
    }
  }

  toggleMessageForm(): void {
    this.messageFormVisible = !this.messageFormVisible;
  }

 

  statusLabel(s: string): string {
    return {libre:'Disponible', retenu:'Retenu', 'donné':'Donné', 'donne':'Donné'}[s] || s;
  }

  resolveImg(img: any): string {
    if (!img || typeof img !== 'string') return '';
    // Full URL (new system: uploaded to /uploads/)
    if (img.startsWith('http') || img.startsWith('data:')) return img;
    // Legacy asset path
    return '/assets/' + img;
  }

  getCurrentImage(): string | null {
    if (!this.article?.images?.length) return null;
    return this.resolveImg(this.article.images[this.currentIndex]);
  }

  avatarColor(id: number): string {
    const colors = ['#16a34a','#2563eb','#7c3aed','#d97706','#dc2626','#0891b2'];
    return colors[id % colors.length];
  }
  share(): void {
    if (navigator.share) {
      navigator.share({ title: this.article?.title || 'Article Clothed', url: window.location.href });
    } else {
      navigator.clipboard?.writeText(window.location.href);
    }
  }
}

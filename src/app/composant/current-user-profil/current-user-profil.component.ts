import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth_service/auth.service';
import { ArticleService } from 'src/app/services/article_service/article.service';
import { Article } from 'src/app/models/articles.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormBuilder,FormGroup } from '@angular/forms';
import { User } from 'src/app/models/user.model';
import * as bcrypt from 'bcryptjs';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { DeleteconfirmationComponent } from '../deleteconfirmation/deleteconfirmation.component';
import { Router } from '@angular/router';






@Component({
  selector: 'app-current-user-profil',
  templateUrl: './current-user-profil.component.html',
  styleUrls: ['./current-user-profil.component.css']
})
export class CurrentUserProfilComponent implements OnInit {
  IsEditing: boolean = false
  userForm: FormGroup;
  profileImageUrl: string | undefined;
  currentUser: User|undefined;
  isOldPasswordCorrect: boolean = false;
  private currentUserSubscription: Subscription | undefined;
  profilPicture : boolean = false;
  profilPictureMessage :string = "";
  modify_password :boolean = false;

  
 currentUserArticles: Article[] = [];
  constructor(private authService: AuthService,private articleService: ArticleService,private formBuilder: FormBuilder, private http: HttpClient,public dialog: MatDialog, private router: Router) {
    //Init du formulaire de l'utilisateur
    this.userForm = this.formBuilder.group({
      firstName :[''],
      lastName : [''],
      email :[''], 
      oldPassword: [''],
      newPassword: [''],
      confirmPassword: [''],
      city : [''],
      address:[''],
      pdp : [''],
      
    })
  }
  ngOnInit(): void {
    //Récupération des articles de l'utilisateur courant lors du chargement du composant
    this.getcurrentuserarticles();
    // Récupération de l'utilisateur courant
    this.currentUser = this.getcurrentuser() || undefined;
    // Souscription aux changements de l'utilisateur courant
    this.currentUserSubscription = this.authService.currentUserObservable.subscribe((user) => {
      if (user){
      this.currentUser = user;}
    });
  }

  ngOnDestroy(): void {
    // Désabonnement lors de la destruction du composant pour éviter les fuites de mémoire
    if (this.currentUserSubscription) {
      this.currentUserSubscription.unsubscribe();
    }
  }

  toggleEditing(field: string) {
    this.IsEditing = !this.IsEditing;
  }

 /*
 * Description : Vérification du mot de passe saisi par l'utilisateur 
 *               dans le formulaire pour s'assurer qu'il correspond à son ancien mot de passe.
 * --------------------------------------------------------------
 * Paramètres : Aucun
 * --------------------------------------------------------------
 * Retour : Aucun
 */

 validateOldPassword() {
  const olduserPassword = this.currentUser?.password;
  const oldPassword = this.userForm.value.oldPassword;

  //assertion
  console.assert(oldPassword !== null && olduserPassword!== null ,"le mdp saisi par l'utilisateur et l'ancien mot de passe ne doivent pas être null")
  
  if (olduserPassword && oldPassword) {

    bcrypt.compare(oldPassword, olduserPassword)
      .then((passwordMatch) => {
        this.isOldPasswordCorrect = passwordMatch;
        console.log(this.isOldPasswordCorrect);
      })
      .catch((error) => {
        console.error("Erreur lors de la comparaison des mots de passe:", error);
        this.isOldPasswordCorrect = false;
      });
  } else {
    console.error("Le mot de passe actuel ou le mot de passe saisi est undefined.");
    this.isOldPasswordCorrect = false;
  }
}
 
  /*
 * Description : Vérifie si la confirmation du mot de passe correspond au nouveau mot de passe saisi.
 * --------------------------------------------------------------
 * Paramètres : Aucun
 * --------------------------------------------------------------
 * Retour : Un booléen indiquant si la confirmation du mot de passe est correcte.
 */
  validatePasswordConfirmation(): boolean {
    const newPassword = this.userForm.value.newPassword;
    const confirmPassword = this.userForm.value.confirmPassword;

    //assertion
    console.assert(newPassword !== null && confirmPassword !== null, "Les nouveaux mots de passe saisis ne doivent pas être null");
  
  
    if (!newPassword && !confirmPassword) {
      return true;
    }
  
    return newPassword === confirmPassword;
  }
  
  modify_password_click(){
    this.modify_password = true;
  }
  
  /*
 * Description : Enregistre les modifications apportées au profil de l'utilisateur.
 * --------------------------------------------------------------
 * Paramètres : Aucun
 * --------------------------------------------------------------
 * Retour : Aucun
 */
  saveChanges() {
    const newPassword = this.userForm.value.newPassword;
    const userId = this.currentUser?.id;

    // Assertions
    console.assert(newPassword !== null, "Le nouveau mot de passe ne doit pas être null");
    console.assert(userId !== null, "L'identifiant de l'utilisateur ne doit pas être null");
  
    if (userId) {
      const updatedUser: any = {};
      updatedUser.id = this.currentUser?.id;
  
      if (this.validatePasswordConfirmation() && newPassword) {
        bcrypt.hash(newPassword, 10)
          .then((hashedPassword) => {
            updatedUser.password = hashedPassword;
              this.continuerSaveChanges(userId, updatedUser, this.userForm.value);
          })
          .catch((error) => {
            console.error("Erreur lors du hachage du mot de passe:", error);
            
          });
      } else {
        this.continuerSaveChanges(userId, updatedUser, this.userForm.value);
      }
    }
  }
  
  /*
 * Description : Envoie les modifications du profil utilisateur au serveur pour enregistrement.
 * --------------------------------------------------------------
 * Paramètres :
 *   - userId: Identifiant de l'utilisateur.
 *   - updatedUser: Objet contenant les informations mises à jour de l'utilisateur.
 *   - formValue: Valeurs du formulaire de modification du profil.
 * --------------------------------------------------------------
 * Retour : Aucun
 */
  private continuerSaveChanges(userId: any, updatedUser: any, formValue: any): void {
    // Mise à jour des propriétés de l'utilisateur avec juste les valeurs du formulaire qui sont remplies
    if (formValue.firstName) {

      //assertion
      console.assert(formValue.firstName !== null, "Le prénom dans le formulaire ne doit pas être null")
      updatedUser.firstName = formValue.firstName;
    } else {
      updatedUser.firstName = this.currentUser?.firstName;
    }
    
    if (formValue.pdp){

      //assertion
      console.assert(formValue.pdp !== null, "La photo de profil dans le formulaire ne doit pas être null");
      updatedUser.pdp = formValue.pdp;
    } else {
      updatedUser.pdp = this.currentUser?.pdp;
    }
    if (formValue.lastName) {
      //assertion
      console.assert(formValue.lastName !== null, "Le nom de famille dans le formulaire ne doit pas être null");
      updatedUser.lastName = formValue.lastName;
    } else {
      updatedUser.lastName = this.currentUser?.lastName;
    }
    
    if (formValue.city) {
      //assertion
      console.assert(formValue.city !== null, "La ville dans le formulaire ne doit pas être null");

      updatedUser.city = formValue.city;
    } else {
      updatedUser.city = this.currentUser?.city;
    }
    if (formValue.address) {

      //assertion 
      console.assert(formValue.address !== null, "L'adresse dans le formulaire ne doit pas être null");
      updatedUser.address = formValue.address;
    } else {
      updatedUser.address = this.currentUser?.address;
    }
    
    // Envoi de la requête POST pour mettre à jour les informations utilisateur dans le backend
    this.http.post<any>(`http://localhost:5000/api/update-user/${userId}`, updatedUser).subscribe({
      next: (response: any) => {
        console.log(response);
        if (response.success) {

          //assertion
          console.assert(updatedUser !== undefined, 'updatedUser ne doit pas être undefined');
          this.authService.currentUser = updatedUser;
          this.IsEditing = false;
          this.getcurrentuserarticles();
        } else {
          console.error(response.message);
        }
      },
      error: (error: any) => {
        console.error('Erreur lors de la mise à jour des informations utilisateur', error);
      },
    });
  }
  

   /*
  description : Traite la sélection d'un image de profil par l'utilisateur
  ----------------------------------------------------------------------------------------------------------------------------
  Paramètres : 
    event : évenement déclenché lors de la sélection d'un fichier
  ----------------------------------------------------------------------------------------------------------------------------
  return  :
    aucun valeur de retour
  */
  onFileSelected(event: any) {
    const files = event.target.files;
  
    if (files && files.length > 0) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string;
        this.profileImageUrl = imageUrl;
  
        const fileName = files[0].name;
        const filePath = `assets/${fileName}`;
  
        this.userForm.controls['pdp'].setValue(filePath);
        this.profilPicture = true;
        this.profilPictureMessage = "Photo ajoutée avec succès";
        console.log(this.profilPictureMessage);
      };
      reader.readAsDataURL(files[0]);
    }
  }
  
  //Getter 
  getcurrentuser(): User | null {
    return this.authService.currentUser || null;
  }
  
  //Getter du Prénom de l'utilisateur connecté
  getcurrentuserfirstname(){
    return this.authService.currentUser?.firstName
  }
  //Getter du nom de l'utilisateur connecté
  getcurrentuserlastname(){ 
    return this.authService.currentUser?.lastName
  }
  //Getter du email de l'utilisateur connecté
  getcurrentuseremail(){
    return this.authService.currentUser?.email
  }
  
  //Getter du ville de l'utilisateur connecté
  getcurrentuserville(){
    return this.authService.currentUser?.city
  }
  //Getter du Adresse de l'utilisateur connecté
  getcurrentuseraddress(){
    return this.authService.currentUser?.address
  }

  //Getter du photo de profil de l'utilisateur connecté
  getcurrentuserpdp(){
    return this.authService.currentUser?.pdp
  }
  //Getter du mot passe on le remplaçant par des étoiles
  getcurrentuserhiddenmdp(){
  const currentPassword = this.authService.currentUser?.password || '';
  return currentPassword.replace(/./g, '*');
  }

  /*
 * Description : Récupération les Articles de l'utilisateur connécté pour les afficher dans les
  *              dans son profil
 * --------------------------------------------------------------
 * Paramètres : Aucun
 * --------------------------------------------------------------
 * Retour : Aucun
 */
  getcurrentuserarticles() {
    const userId = this.authService.currentUser?.id;

    //assertion
    console.assert(userId !== null, 'L\'identifiant de l\'utilisateur ne doit pas être null');
    if (userId) {
      this.articleService.getArticlesByUserId(userId).subscribe({
        next: (articles: Article[]) => {
          //assertion
          console.assert(this.currentUserArticles !== undefined, 'Les articles de l\'utilisateur ne doivent pas être undefined')
          this.currentUserArticles = articles;
          console.log(this.currentUserArticles);
        },
        error: (error: any) => {
          console.error('Erreur lors de la récupération des articles de l\'utilisateur courant', error);
        }
      });
    }
  }

  /*
 * Description : Récupère l'URL de la première image associée à l'article.
 * --------------------------------------------------------------
 * Paramètres :
 *    - article : L'article dont on veut récupérer l'image
 * --------------------------------------------------------------
 * Retour : L'URL de la première image de l'article ou undefined si aucune image n'est disponible.
 */
  GetFirstImageUrl(article: Article): string | undefined {
    if (article && Array.isArray(article.images) && article.images.length > 0) {
      const firstImage = article.images[0];
      console.assert(firstImage!==undefined,"la 1éer image ne doit pas être null");
  
      if (typeof firstImage === 'string') {
        return `/assets/${firstImage}`;
      }
    }
  
    return undefined;
  }

  
 /*
 * Description : Supprime un article en envoyant une requête de suppression au service d'articles.
 *                Rafraîchit ensuite la liste des articles de l'utilisateur courant.
 * --------------------------------------------------------------
 * Paramètres :
 *   - article: L'article à supprimer.
 * --------------------------------------------------------------
 * Retour : Aucun
 */
  onClickDeleteArticle(article: any): void {
    const articleId = article.id;
    //assertion
    console.assert(article !== null , 'L\'article passé en paramètre ne doit pas être null');
    this.articleService.deleteArticle(articleId).subscribe({
      next: (response: any) => {
        console.log(response);

        this.getcurrentuserarticles();
      },
      error: (error: any) => {
        console.error('Erreur lors de la suppression de l\'article', error);
      },
    });
  }
  
  /*
 * Description : Ouvre une boîte de dialogue de confirmation de suppression d'article.
 *                Lorsque la boîte de dialogue se ferme, vérifie le résultat.
 *                Si l'utilisateur confirme la suppression, appelle la fonction pour supprimer l'article.
 * --------------------------------------------------------------
 * Paramètres :
 *   - article: L'article à supprimer.
 * --------------------------------------------------------------
 * Retour : Aucun
 */

  openDeleteConfirmationDialog(article: Article): void {
    //assertion
    console.assert(article !== null , 'L\'article passé en paramètre ne doit pas être null');

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

  // redirection vers la composante article
  article_navigate(){
    this.router.navigate(['article'])
  }

  

  getInitials(): string {
    const u = this.authService.currentUser;
    return u ? (u.firstName?.[0] || '') + (u.lastName?.[0] || '') : '?';
  }

  get avatarColor(): string {
    const id = this.authService.currentUser?.id || 0;
    const colors = ['#16a34a','#2563eb','#7c3aed','#d97706','#dc2626','#0891b2'];
    return colors[id % colors.length];
  }
  hasPhoto(): boolean {
    const p = this.authService.currentUser?.pdp;
    return !!(p && p !== 'assets/44.png');
  }

  getLibreCount(): number {
    return this.currentUserArticles.filter(a => a.statut === 'libre').length;
  }
  resolveImg(img: any): string {
    if (!img || typeof img !== 'string') return '';
    if (img.startsWith('data:') || img.startsWith('http')) return img;
    return '/assets/' + img;
  }
}

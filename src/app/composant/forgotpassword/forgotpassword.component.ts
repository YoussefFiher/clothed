import { Component } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from 'src/app/services/user/user.service';
import { User } from 'src/app/models/user.model';
import { Router } from '@angular/router';


@Component({
  selector: 'app-forgotpassword',
  templateUrl: './forgotpassword.component.html',
  styleUrls: ['./forgotpassword.component.css']
})
export class ForgotpasswordComponent {
  
  userExists: boolean= false;
  passwordform: FormGroup;
  confirmationCodeForm: FormGroup;
  showChangePasswordForm : FormGroup;
  showConfirmationCodeForm: boolean = false;
  email : string = '';
  showChange : boolean = false;
  confirmmsg : boolean = false;
  errorMessage : boolean = false;
  successMessage : boolean = false;
  cofirmbutton : boolean = false;
  userdata : User | null | undefined 
  mailconfirmmsg : boolean = false;


  constructor(private http: HttpClient, private formBuilder: FormBuilder, private userService: UserService, private router: Router) {
    //initialisation de formulaire de changement de mot de passe avec  les champs requis
    this.passwordform = formBuilder.group({
      "email": ["", Validators.required],
    });
    this.confirmationCodeForm = formBuilder.group({
      "confirmationCode": ["", Validators.required],
    });
    this.showChangePasswordForm = formBuilder.group({
      "newPassword" : ['',[Validators.required]],
      "confirmedNewPassword": ['', Validators.required],

    });

  }

  /*
  description :  Soumet le formulaire de l'e-mail et appel de la fonction userexist()
  ----------------------------------------------------------------------------------------------------------------------------
  Paramètres : aucun
  ----------------------------------------------------------------------------------------------------------------------------
  return  :aucun
  */

  onSubmit() {
    const email = this.passwordform.get("email")?.value;
    console.assert(email != "", "Email ne doit pas être null");
    this.email = email
    this.userExist(email);
  }

  /*
  description :  verification de si l'email de l'utilisateur existe dans la base de données, si oui appelle
  la function sendforgotpassword() 
  ----------------------------------------------------------------------------------------------------------------------------
  Paramètres : email de l'utilisateur qui veut changer son mot de passe 
  ----------------------------------------------------------------------------------------------------------------------------
  return  :aucun
  */
  userExist(email: string) {
    this.errorMessage  = false;
    this.userService.getUserByEmail(email).subscribe({
      next: (userData: User | null) => {
        this.userdata = userData;
        this.userExists = userData !== null;
        //assertion
        console.assert(this.userExists !== null,"il faut que l'utilisateur existe")

        if (this.userExists && this.userdata?.isConfirmed==true) {

          //assertion
          console.assert(this.userdata?.isConfirmed==true , "l'email de l'utilisateur doit être confirmer")
          this.showConfirmationCodeForm = true;
          //géneration d'un code aléatoire
          const forgotPassword = this.generatecode();


          //assertion
          console.assert(forgotPassword !== null,"le code ne doit pas être null");


          this.sendForgotPassword(email, forgotPassword);
          this.cofirmbutton = false;
          this.successMessage = true;
        }else if(this.userdata?.isConfirmed ==false){
          this.mailconfirmmsg=true;
          this.cofirmbutton=true;
        }
      },
      error: (error: HttpErrorResponse) => {
        if (error.status === 404) {
          this.errorMessage = true;
          this.successMessage = false;
        }
      }
    });
  }
  

  /*
  description :  renoyer un code de confirmation a l'émail de l'utilisateur contenant le code genéré par la fonction 
  generatecode() on utilisant un post dont le body sera l'émail et le code de confirmation passés en paramétre 
  ----------------------------------------------------------------------------------------------------------------------------
  Paramètres : 
    email : email de l'utilisateur qui a oublié son mot de passe
    forgotPassword : le code de confirmation généré par la fonction generatecode()
  ----------------------------------------------------------------------------------------------------------------------------
  return  :aucun
  */
  sendForgotPassword(email: string, forgotPassword: string) {
    this.http.post('http://localhost:5000/api/forgotPassword', { email, forgotPassword })
      .subscribe({
        next: (response: any) => {
          console.log("Requête POST envoyée avec succès");
        },
        error: (error: any) => {
          console.error("Erreur lors de l'envoi de la requête POST:", error);
        }
      });
  }

  //Génère un code de confirmation aléatoire
  generatecode(): string {
    const confirmationcode = Math.random().toString(36).substring(7);
    
    console.assert(confirmationcode !== null, "Confirmationcode ne doit pas être null")
    return confirmationcode;
  }

  /*
  description :  verifie le code de confirmation envoyé par l'email de l'utilisateur si c'est le meme 
  que celui saisi par l'utilisateur
  ----------------------------------------------------------------------------------------------------------------------------
  Paramètres : aucun
  ----------------------------------------------------------------------------------------------------------------------------
  return  :aucun
  */
  onSubmitConfirmationCode() {
    const confirmationCode = this.confirmationCodeForm.get("confirmationCode")?.value;
    //assertion
    console.assert(confirmationCode !== null, "le code de confirmation ne doit pas être null")
    
    this.http.get(`http://localhost:5000/api/${this.email}`).subscribe({
      next: (userData: any) => {
        
        const expectedConfirmationCode = userData.forgotPassword;
        
        //assertion

        console.assert(expectedConfirmationCode!== null,"expectedConfirmationCode ne doit pas être null")

        if (userData.isConfirmed && confirmationCode === expectedConfirmationCode) {
          //assertion
          console.assert(userData.isConfirmed === true, "l'email de  l'utilisateur doit être confirmé")
          //assertion
          console.assert(confirmationCode === expectedConfirmationCode, "Le code de confirmation envoyé par e-mail doit être le même que celui saisi par l'utilisateur")
          this.showChange= true;
          this.successMessage = false;
        } else {
          window.alert('le code de confirmation est incorrect')
        }
      },
      error: (error: any) => {
        console.error('Erreur lors de la récupération des données utilisateur:', error);
      }
    });
  }
  
   /*
  description :  redirection vers la page de confirmation d'email si l'utilisateur n'as pas encore verifié 
  son email
  ----------------------------------------------------------------------------------------------------------------------------
  Paramètres : aucun
  ----------------------------------------------------------------------------------------------------------------------------
  return  :aucun
  */
  navigateToconfirmmail(){
    const usermail = this.userdata?.email;
    //assertion

    console.assert(usermail !== null , "l'émail de l'utilisateur doit exister")
    
    this.router.navigate(['confirmation/', usermail]);
  
    this.http.post(`http://localhost:5000/api/resend-confirmation`, { email: usermail })
      .subscribe();
  }



  /*
  description :  stockage du nouveau mot de passe de l'utilisateur  via un post dans le body 
  contient que le nouveau mot de passe
  ----------------------------------------------------------------------------------------------------------------------------
  Paramètres : aucun
  ----------------------------------------------------------------------------------------------------------------------------
  return  :aucun
  */

  onChangePassword() {
    const newPassword = this.showChangePasswordForm.get("newPassword")?.value;
    const confirmedNewPassword = this.showChangePasswordForm.get("confirmedNewPassword")?.value;

    //assertion
    console.assert(newPassword !== null && confirmedNewPassword !== null,"le mote de passe et la confirmation du mot de passe ne doit pas être null ")
    
    
    if (newPassword !== confirmedNewPassword) {
      
      window.alert('Les mots de passe ne correspondent pas.');
      return;
    }
    //assertion
    console.assert(newPassword == confirmedNewPassword,"le mot de passe et sa confirmation doit être les mêmes")

    const email = this.email;

    console.assert(email!==null ,"l'email de l'utilisateur ne doit pas être null")
    this.confirmmsg = true;
    this.http.post(`http://localhost:5000/api/onchangepassword/${email}`, { newPassword })
      .subscribe({
        next: (response: any) => {
          setTimeout(() => {
            this.router.navigate(['connexion']);
          }, 2000);
          
        },
        error: (error: any) => {
          console.error("Erreur lors de la mise à jour du mot de passe:", error);
          window.alert('Une erreur est survenue lors de la mise à jour du mot de passe. Veuillez réessayer.');
        }
      });
  }
}

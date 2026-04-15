import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from 'src/app/services/user/user.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { tap, catchError } from 'rxjs/operators';
import * as bcrypt from 'bcryptjs';



@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {

  subscribeduserid: number = 0;
  registrationSuccess: boolean = false;
  profilPicture : boolean = false;
  profilPictureMessage :string = "";
  signUpForm: FormGroup;
  profileImageUrl: string | undefined;
  emailExists : boolean = false;

  constructor(private formBuilder: FormBuilder, private userService: UserService,private router: Router,private http : HttpClient) {
    //Initialise le formulaire d'inscription avec les champs requis et les validateurs
    this.signUpForm = this.formBuilder.group({
      'firstname': ['', Validators.required],
      'lastname': ['', Validators.required],
      'email': ['', [Validators.required, Validators.email]],
      'password': ['', Validators.required],
      'passwordConfirmation': ['', Validators.required],
      'ville':['', Validators.required],
      'address': ['', Validators.required],
      'pdp' :[null],
      'confirmcode' : [this.generatecode()],
      'isConfirmed': [false]
    }, { asyncValidators: this.passwordConfirmationValidator.bind(this) });

  }
  /*
  description : Verifie si les champs de mots de passe et de confirmation de mots de passe correspendent 
  ----------------------------------------------------------------------------------------------------------------------------
  Paramètres : 
    control : Contrôle abstrait du formulaire
  ----------------------------------------------------------------------------------------------------------------------------
  return  :
    une promesse résolue si les mots de  passent correspendent,
    sinon une promessse rejeté indiquent le non-correspendance

  */
  passwordConfirmationValidator(control: AbstractControl): Promise<{ [key: string]: boolean } | null> {
    return new Promise((resolve) => {
      const password = control.get('password');
      // Assertion : Le mot de passe ne doit pas être null
      console.assert(password!==null,"le mot de passe ne doit pas être null")

      const passwordConfirmation = control.get('passwordConfirmation');
      // Assertion : La confirmation de mot de passe ne doit pas être null
      console.assert(passwordConfirmation!==null,"le mot de passe ne doit pas être null")


      if (password && passwordConfirmation && password.value !== passwordConfirmation.value) {

        // Assertion : Les mots de passe ne correspondent pas
        console.assert(password.value !== passwordConfirmation.value)
        resolve({ 'mismatchedPassword': true });
      } else {
        resolve(null);
      }
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

    //assertion pour verfier que le resultat de chargement est défini 
    console.assert(reader!==null,"Le FileReader n'a pas été créé avec succès")

    reader.onload = (e) => {
      const imageUrl = e.target?.result as string;
      this.profileImageUrl = imageUrl;

      
      const fileName = files[0].name;
      const filePath = `assets/${fileName}`;

      this.signUpForm.controls['pdp'].setValue(filePath);
      this.profilPicture = true;
      this.profilPictureMessage = "photo de profile ajouté avec succès";;
    };
    reader.readAsDataURL(files[0]);
  }
}
  

/*
  description : Soumet les données du formulaire d'inscription aprés validation 
  ----------------------------------------------------------------------------------------------------------------------------
  Paramètres : aucun
  ----------------------------------------------------------------------------------------------------------------------------
  return  : aucun
  */


onSubmitSignup() {
  const userData = this.signUpForm.value;
  
  console.log(userData.confirmcode);

  //assertion pour verifier que userData existe
  console.assert(userData, 'UserData est null ou non défini');

  const saltRounds = 10; 
  // hashage du mot de passe on utilisant bcrypt
  const hashedPassword = bcrypt.hashSync(userData.password, saltRounds);

  userData.password = hashedPassword;
  if (userData.pdp === null) {
    userData.pdp ='/assets/44.png'
  }

  
  // utilisation d'une requéte http post pour envoyer les données au server.ts 
  this.http.post('http://localhost:5000/api/signup', userData)
    .pipe(
      tap((response: any) => {
        console.log('Inscription réussie!', response);
        this.router.navigate(['confirmation',userData.email]); 
      }),
      catchError((error) => {
        console.error('Erreur lors de l\'inscription', error);
        throw error;
      })
    )
    .subscribe();
}

/*
  description : Génère un code de confirmation aléatoire pour l'utilisateur
  ----------------------------------------------------------------------------------------------------------------------------
  Paramètres : aucun
  ----------------------------------------------------------------------------------------------------------------------------
  return  : aucun
  */
 
generatecode():string {
  const confirmationcode = Math.random().toString(36).substring(7);
  return confirmationcode
}
}

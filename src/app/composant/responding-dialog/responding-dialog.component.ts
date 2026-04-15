import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AuthService } from 'src/app/services/auth_service/auth.service';
import { MessageService } from 'src/app/services/message_service/message.service';
import { Message } from 'src/app/models/message.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-responding-dialog',
  templateUrl: './responding-dialog.component.html',
  styleUrls: ['./responding-dialog.component.css']
})
export class RespondingDialogComponent {
  responseForm: FormGroup;


  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<RespondingDialogComponent>,
    private authService: AuthService,
    private messageService: MessageService,
    private fb: FormBuilder
  ) {
    //initialisation de la formulaire de réponse avec un champ de contenu requis
    this.responseForm = this.fb.group({
      responseContent: ['', Validators.required]
    });
  }


  //Fermeture de la boite de dialogue en cas d'annulation
  onCancelClick(): void {
    this.dialogRef.close();
  }


  /*
    description : Envoie de la réponse on usilisant une requête post Via focnction sendMessace
    dans le service MessageService
    ----------------------------------------------------------------------------------------------------------------------------
    Paramètres : aucun
    ----------------------------------------------------------------------------------------------------------------------------
    return  : aucun
  */
  onSendResponse(): void {

    //assertion : Vérifie si le formumaire est valide avant d'envoyer la réponse

    console.assert(this.responseForm.valid, "le formulaire de réponse n'est pas valdie")

    if (this.responseForm.invalid) {
      console.log("oups")
      return;
    }
    
    const senderId = this.authService.currentUser?.id;
    const receiverId = this.data.receiverId;
    const articleId = this.data.articleId;

    // Assertion : Vérifie que senderId et receiverId sont définis
    console.assert(senderId !== undefined && receiverId !== undefined,"l'expediteur ou le destinataire n'est pas défini")

    if (!senderId || !receiverId) {
      this.dialogRef.close();
      return;
    }

    const content = `Réponse: ${this.responseForm.value.responseContent}`;

    const responseMessage: Message = {
      id: 0,
      senderId: senderId,
      receiverId: receiverId,
      content: content,
      articleId: articleId,
      createdAt: new Date()
    };

    this.messageService.sendMessage(responseMessage).subscribe({
      next: (response: any) => {
        console.log('Réponse envoyée avec succès', response);
      },
      error: (error: any) => {
        console.error('Erreur lors de l\'envoi de la réponse', error);
      }
    });

    this.dialogRef.close();
  }
}

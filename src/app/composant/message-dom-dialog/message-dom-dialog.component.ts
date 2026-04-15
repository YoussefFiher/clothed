import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth_service/auth.service';
import { MessageService } from 'src/app/services/message_service/message.service';

@Component({
  selector: 'app-message-dom-dialog',
  templateUrl: './message-dom-dialog.component.html',
  styleUrls: ['./message-dom-dialog.component.css'],
})
export class MessageDomDialogComponent {
  requestForm: FormGroup;
  sent = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<MessageDomDialogComponent>,
    private fb: FormBuilder,
    private authService: AuthService,
    private messageService: MessageService,
  ) {
    this.requestForm = this.fb.group({
      firstName:   ['', Validators.required],
      lastName:    ['', Validators.required],
      address:     ['', Validators.required],
      asblName:    [''],
      asblCity:    [''],
      asblAddress: [''],
    });
  }

  onCancelClick(): void { this.dialogRef.close(); }

  onSendMessage(): void {
    if (!this.requestForm.valid) return;
    const { firstName, lastName, address, asblName, asblCity, asblAddress } = this.requestForm.value;

    let content = `Bonjour, je suis ${firstName} ${lastName} et j'habite à ${address}. Je souhaiterais recevoir votre article à cette adresse.`;
    if (this.data.requestType === 'asbl') {
      content += ` Je représente l'ASBL "${asblName}" située à ${asblCity}, ${asblAddress}.`;
    }

    this.messageService.sendMessage({
      id: 0,
      senderId:   this.authService.currentUser?.id || 0,
      receiverId: this.data.receiverId,
      content,
      articleId:  this.data.articleId,
      createdAt:  new Date(),
    }).subscribe({
      next: () => { this.sent = true; },
      error: () => { this.dialogRef.close(); },
    });
  }
}

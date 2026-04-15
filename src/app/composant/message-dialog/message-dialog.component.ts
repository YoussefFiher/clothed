import { Component, Inject, ViewChild, ElementRef } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth_service/auth.service';
import { MessageService } from 'src/app/services/message_service/message.service';
import { Message } from 'src/app/models/message.model';

@Component({
  selector: 'app-message-dialog',
  templateUrl: './message-dialog.component.html',
  styleUrls: ['./message-dialog.component.css'],
})
export class MessageDialogComponent {
  @ViewChild('textareaEl') textareaEl!: ElementRef;

  messageForm: FormGroup;
  charCount = 0;

  quickSuggestions = [
    'Est-il disponible ?',
    'Je suis interess\u00e9(e) !',
    'Quelle est la taille ?',
  ];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<MessageDialogComponent>,
    private fb: FormBuilder,
    private authService: AuthService,
    private messageService: MessageService,
  ) {
    this.messageForm = this.fb.group({ content: ['', [Validators.required, Validators.maxLength(300)]] });
  }

  updateCount(): void {
    this.charCount = this.messageForm.value.content?.length || 0;
  }

  useSuggestion(s: string): void {
    this.messageForm.patchValue({ content: s });
    this.charCount = s.length;
  }

  onCancelClick(): void { this.dialogRef.close(); }

  onSendMessage(): void {
    const content = this.messageForm.get('content')?.value;
    if (!content) { this.dialogRef.close(); return; }
    const senderId   = this.authService.currentUser?.id;
    const receiverId = this.data.receiverId;
    const articleId  = this.data.articleId;
    if (!senderId || !receiverId) { this.dialogRef.close(); return; }
    const msg: Message = { id: 0, senderId, receiverId, articleId, content: `Message: ${content}`, createdAt: new Date() };
    this.messageService.sendMessage(msg).subscribe({
      next: () => { this.dialogRef.close({ sent: true }); },
      error: () => { this.dialogRef.close(); },
    });
  }
}

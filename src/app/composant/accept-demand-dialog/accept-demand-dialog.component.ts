import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ArticleService } from 'src/app/services/article_service/article.service';
import { MessageService } from 'src/app/services/message_service/message.service';
import { AuthService } from 'src/app/services/auth_service/auth.service';

@Component({
  selector: 'app-accept-demand-dialog',
  templateUrl: './accept-demand-dialog.component.html',
  styleUrls: ['./accept-demand-dialog.component.css']
})
export class AcceptDemandDialogComponent implements OnInit {
  AcceptForm: FormGroup;
  today: string = new Date().toISOString().split('T')[0];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<AcceptDemandDialogComponent>,
    private fb: FormBuilder,
    private articleService: ArticleService,
    private messageService: MessageService,
    private authService: AuthService,
  ) {
    this.AcceptForm = this.fb.group({
      delivery: ['bpost', Validators.required],
      Date: ['', Validators.required],
    });
  }

  ngOnInit(): void {}

  onCancel(): void { this.dialogRef.close(); }

  onSubmit(): void {
    if (this.AcceptForm.invalid) return;

    const { delivery, Date: date } = this.AcceptForm.value;
    const deliveryLabels: Record<string, string> = {
      bpost: 'Bpost', dhl: 'DHL Express', retrait: 'Retrait en main propre', autres: 'Autre transporteur'
    };

    // Update article status to 'retenu'
    this.articleService.updateArticleStatus(this.data.articleId, 'retenu').subscribe();

    // Send confirmation message
    const confirmMsg = {
      senderId: this.data.senderId,
      receiverId: this.data.receiverId,
      content: `✅ Don accepté ! Livraison via ${deliveryLabels[delivery]} prévue le ${date}. Merci pour votre générosité !`,
      articleId: this.data.articleId,
    };
    this.messageService.sendMessage(confirmMsg).subscribe();

    this.dialogRef.close({ accepted: true });
  }
}

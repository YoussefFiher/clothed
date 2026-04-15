import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-deleteconfirmation',
  templateUrl: './deleteconfirmation.component.html',
  styleUrls: ['./deleteconfirmation.component.css']
})
export class DeleteconfirmationComponent {
  constructor(
    public dialogRef: MatDialogRef<DeleteconfirmationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  // Ferme la boîte de dialogue en envoyant false comme résultat
  onCancelClick(): void {
    this.dialogRef.close(false);
  }

  // Ferme la boîte de dialogue en envoyant true comme résultat
  onConfirmClick(): void {
    this.dialogRef.close(true);
  }
}

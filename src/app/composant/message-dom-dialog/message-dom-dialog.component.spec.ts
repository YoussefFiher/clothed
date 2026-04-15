import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MessageDomDialogComponent } from './message-dom-dialog.component';
import { ReactiveFormsModule } from '@angular/forms';
describe('MessageDomDialogComponent', () => {
  let component: MessageDomDialogComponent;
  let fixture: ComponentFixture<MessageDomDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MessageDomDialogComponent],
      imports: [HttpClientTestingModule,MatDialogModule,ReactiveFormsModule],
      providers: [
        { provide: MatDialogRef, useValue: {} },
        { provide: MAT_DIALOG_DATA, useValue: {} }
      ]
    });
    fixture = TestBed.createComponent(MessageDomDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

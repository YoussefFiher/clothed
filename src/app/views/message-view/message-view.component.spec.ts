import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterModule,ActivatedRoute} from '@angular/router';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { AcceuilHeaderComponent } from 'src/app/composant/acceuil-header/acceuil-header.component';
import { MessageViewComponent } from './message-view.component';
import { of } from 'rxjs';
import { Message } from 'src/app/models/message.model';

describe('MessageViewComponent', () => {
  let component: MessageViewComponent;
  let fixture: ComponentFixture<MessageViewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MessageViewComponent,AcceuilHeaderComponent],
      imports: [HttpClientTestingModule,MatDialogModule,RouterModule],
      providers: [
        { provide: MatDialogRef, useValue: {} },
        { provide: MAT_DIALOG_DATA, useValue: {} },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: new Map().set('someKey', 'someValue')
            }
          }
        }
      ]
    });
    fixture = TestBed.createComponent(MessageViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should fetch messages by sender ID', () => {
    const senderId = 1; // Replace with a valid sender ID for testing
    spyOn(component['messageService'], 'getMessagesBySenderId').and.returnValue(of([])); // Mock the messageService method
    component.getSortedUsermessages(senderId);
    expect(component['messageService'].getMessagesBySenderId).toHaveBeenCalledWith(senderId);
  });

  it('should sort messages by sender ID', () => {
    const conversations: Message[] = [
      { id: 1, senderId: 4, receiverId: 2, content: 'Message 1', articleId: 1 },
      { id: 2, senderId: 5, receiverId: 1, content: 'Message 2', articleId: 2 },
      { id: 3, senderId: 6, receiverId: 3, content: 'Message 3', articleId: 3 }
    ];
    component.conversations = conversations;
    component.getSortedUsermessages(1);
    expect(component.sortedmsgs.length).toBe(0); 
  });


});

import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { MessageService } from './message.service';
import { Message } from 'src/app/models/message.model';

describe('MessageService', () => {
  let service: MessageService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [MessageService]
    });
    service = TestBed.inject(MessageService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should send a message successfully', () => {
    const mockMessage: Message = {
      id: 1,
      senderId: 1,
      receiverId: 2,
      content: 'Hello',
      articleId: 1
    };

    service.sendMessage(mockMessage).subscribe(response => {
      expect(response).toEqual(mockMessage);
    });

    const req = httpMock.expectOne('http://localhost:5000/api/messages');
    expect(req.request.method).toBe('POST');
    req.flush(mockMessage);
  });

  it('should retrieve messages by receiver ID', () => {
    const receiverId = 2;
    const mockMessages: Message[] = [
      { id: 1, senderId: 1, receiverId, content: 'Message 1', articleId: 1 },
      { id: 2, senderId: 1, receiverId, content: 'Message 2', articleId: 2 }
    ];

    service.getMessagesByReceiverId(receiverId).subscribe(messages => {
      expect(messages).toEqual(mockMessages);
    });

    const req = httpMock.expectOne(`http://localhost:5000/api/messages/by-receiver/${receiverId}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockMessages);
  });

  it('should retrieve messages by sender ID', () => {
    const senderId = 1;
    const mockMessages: Message[] = [
      { id: 1, senderId, receiverId: 2, content: 'Message 1', articleId: 1 },
      { id: 2, senderId, receiverId: 3, content: 'Message 2', articleId: 2 }
    ];

    service.getMessagesBySenderId(senderId).subscribe(messages => {
      expect(messages).toEqual(mockMessages);
    });

    const req = httpMock.expectOne(`http://localhost:5000/api/messages/by-sender/${senderId}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockMessages);
  });
});

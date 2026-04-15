import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Message } from 'src/app/models/message.model';

@Injectable({ providedIn: 'root' })
export class MessageService {
  private api = 'http://localhost:5000/api/messages';
  constructor(private http: HttpClient) {}
  sendMessage(data: any): Observable<Message> { return this.http.post<Message>(this.api, data); }
  getMessagesByReceiverId(id: number): Observable<Message[]> { return this.http.get<Message[]>(`${this.api}/by-receiver/${id}`); }
  getMessagesBySenderId(id: number): Observable<Message[]> { return this.http.get<Message[]>(`${this.api}/by-sender/${id}`); }
  markAsRead(id: number): Observable<any> { return this.http.patch(`${this.api}/${id}/read`, {}); }
}

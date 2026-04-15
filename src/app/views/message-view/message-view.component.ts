import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { Router } from '@angular/router';
import { Message } from 'src/app/models/message.model';
import { User } from 'src/app/models/user.model';
import { MessageService } from 'src/app/services/message_service/message.service';
import { AuthService } from 'src/app/services/auth_service/auth.service';
import { UserService } from 'src/app/services/user/user.service';
import { MatDialog } from '@angular/material/dialog';
import { AcceptDemandDialogComponent } from 'src/app/composant/accept-demand-dialog/accept-demand-dialog.component';

interface Conv { senderId: number; msgs: Message[]; last: Message; unread: number; }
interface Group { date: string; messages: Message[]; }

const COLORS = ['#16a34a','#2563eb','#7c3aed','#d97706','#dc2626','#0891b2','#db2777'];

@Component({ selector: 'app-message-view', templateUrl: './message-view.component.html', styleUrls: ['./message-view.component.css'] })
export class MessageViewComponent implements OnInit, OnDestroy, AfterViewChecked {
  @ViewChild('msgs') msgsEl!: ElementRef;
  @ViewChild('draftEl') draftEl!: ElementRef;

  received: Message[] = [];
  sent: Message[] = [];
  conversations: Conv[] = [];
  active: Conv | null = null;
  users = new Map<number, User>();
  uid = 0;
  draft = ''; searchQ = ''; showEmoji = false; typing = false;
  totalUnread = 0;
  private scroll = false;
  private poll: any; private typTimer: any;

  EMOJIS = ['😊','❤️','👍','🙏','😄','😂','🎉','🙌','💪','✨','🌟','😍','🤝','💚','🫶','👏','🎁','🌈','🌱','🔥'];

  constructor(private msgSvc: MessageService, private authSvc: AuthService, private userSvc: UserService, private router: Router, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.uid = this.authSvc.currentUser!.id;
    this.load();
    this.poll = setInterval(() => this.load(), 4000);
  }

  ngOnDestroy(): void { clearInterval(this.poll); clearTimeout(this.typTimer); }

  ngAfterViewChecked(): void {
    if (this.scroll) { try { const e = this.msgsEl?.nativeElement; if (e) e.scrollTop = e.scrollHeight; } catch {} this.scroll = false; }
  }

  private load(): void {
    this.msgSvc.getMessagesByReceiverId(this.uid).subscribe({ next: (ms) => {
      const prev = this.received.length;
      this.received = ms;
      this.buildConvs();
      if (ms.length > prev) this.scroll = true;
    }});
  }

  private buildConvs(): void {
    const map = new Map<number, Message[]>();
    for (const m of this.received) {
      const o = m.senderId;
      if (!map.has(o)) map.set(o, []);
      map.get(o)!.push(m);
      this.fetchUser(o);
    }
    this.conversations = Array.from(map.entries()).map(([sid, msgs]) => {
      const sorted = [...msgs].sort((a,b) => +new Date(a.createdAt!) - +new Date(b.createdAt!));
      return { senderId: sid, msgs: sorted, last: sorted[sorted.length-1], unread: msgs.filter(m=>!m.isRead).length };
    }).sort((a,b) => +new Date(b.last.createdAt!) - +new Date(a.last.createdAt!));
    this.totalUnread = this.conversations.reduce((s,c) => s+c.unread, 0);
    if (this.active) { const u = this.conversations.find(c=>c.senderId===this.active!.senderId); if (u) this.active = u; }
  }

  private fetchUser(id: number): void {
    if (this.users.has(id)) return;
    this.userSvc.getUserByID(id).subscribe({ next: u => { if (u) this.users.set(id, u); } });
  }

  filtered(): Conv[] {
    if (!this.searchQ.trim()) return this.conversations;
    const q = this.searchQ.toLowerCase();
    return this.conversations.filter(c => this.name(c.senderId).toLowerCase().includes(q));
  }

  select(conv: Conv): void {
    this.active = conv; this.showEmoji = false; this.scroll = true;
    conv.msgs.forEach(m => { if (!m.isRead && m.receiverId === this.uid) { this.msgSvc.markAsRead(m.id).subscribe(); m.isRead = true; } });
    conv.unread = 0;
    this.msgSvc.getMessagesBySenderId(this.uid).subscribe({ next: s => { this.sent = s.filter(m=>m.receiverId===conv.senderId); this.scroll = true; } });
  }

  allMsgs(): Message[] {
    if (!this.active) return [];
    return [...this.active.msgs, ...this.sent].sort((a,b) => +new Date(a.createdAt!) - +new Date(b.createdAt!));
  }

  grouped(): Group[] {
    const groups: Group[] = []; let last = '';
    for (const m of this.allMsgs()) {
      const d = new Date(m.createdAt!);
      const today = new Date(); const yday = new Date(today); yday.setDate(today.getDate()-1);
      const ds = d.toDateString()===today.toDateString() ? "Aujourd'hui" : d.toDateString()===yday.toDateString() ? 'Hier' : d.toLocaleDateString('fr-FR',{day:'numeric',month:'long'});
      if (ds !== last) { groups.push({date:ds,messages:[]}); last=ds; }
      groups[groups.length-1].messages.push(m);
    }
    return groups;
  }

  send(): void {
    const c = this.draft.trim();
    if (!c || !this.active) return;
    const m = { senderId: this.uid, receiverId: this.active.senderId, content: c, articleId: this.active.last.articleId };
    this.msgSvc.sendMessage(m as any).subscribe({ next: (r:any) => {
      this.sent.push({...r, createdAt: new Date()});
      this.draft = ''; this.scroll = true;
      if (this.draftEl) { this.draftEl.nativeElement.style.height=''; }
      this.showTyping();
    }});
  }

  private showTyping(): void {
    setTimeout(() => { this.typing=true; this.scroll=true;
      this.typTimer = setTimeout(() => { this.typing=false; },2500+Math.random()*1500); },600);
  }

  onDraftInput(): void {
    if (this.draftEl) { const e=this.draftEl.nativeElement; e.style.height=''; e.style.height=Math.min(e.scrollHeight,100)+'px'; }
  }

  onKey(e: any): void { if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();this.send();} }
  addEmoji(em: string): void { this.draft+=em; this.showEmoji=false; }
  openAccept(): void {
    if (!this.active) return;
    this.dialog.open(AcceptDemandDialogComponent, { width:'480px', data:{ receiverId:this.active.senderId, senderId:this.uid, articleId:this.active.last.articleId } });
  }
  isOwner(): boolean { return this.active?.last.article?.user?.id === this.uid; }
  clean(s: string): string { return s.replace(/^(Message:|Réponse:|Reponse:)\s*/i,''); }
  statusLabel(s: string): string { return {libre:'Disponible',retenu:'Retenu','donné':'Donné','donne':'Donné'}[s]||s; }
  name(id: number): string { const u=this.users.get(id); return u?`${u.firstName} ${u.lastName}`:`#${id}`; }
  initials(id: number): string { const u=this.users.get(id); return u?(u.firstName?.[0]||'')+(u.lastName?.[0]||''):'?'; }
  pdp(id: number): string { const u=this.users.get(id); return (u?.pdp&&u.pdp!=='assets/44.png')?u.pdp:''; }
  color(id: number): string { return COLORS[id%COLORS.length]; }
  goProfile(id: number): void { this.router.navigate(['profil',id]); }
  goArticle(id: number): void { this.router.navigate(['article',id]); }
}

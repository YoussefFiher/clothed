import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth_service/auth.service';
import { MessageService } from 'src/app/services/message_service/message.service';
import { Message } from 'src/app/models/message.model';

const AVATAR_COLORS = ['#16a34a','#2563eb','#7c3aed','#d97706','#dc2626','#0891b2','#db2777'];

@Component({
  selector: 'app-acceuil-header',
  templateUrl: './acceuil-header.component.html',
  styleUrls: ['./acceuil-header.component.css']
})
export class AcceuilHeaderComponent implements OnInit, OnDestroy {
  nbmessages = 0;
  avatarColor = AVATAR_COLORS[0];
  private interval: any;

  constructor(public authservice: AuthService, private msg: MessageService, private router: Router) {}

  ngOnInit(): void {
    const id = this.authservice.currentUser?.id;
    if (id) this.avatarColor = AVATAR_COLORS[id % AVATAR_COLORS.length];
    this.loadMsgs();
    this.interval = setInterval(() => this.loadMsgs(), 10000);
  }

  ngOnDestroy(): void { clearInterval(this.interval); }

  private loadMsgs(): void {
    const id = this.authservice.currentUser?.id;
    if (!id) return;
    this.msg.getMessagesByReceiverId(id).subscribe({ next: (ms: Message[]) => { this.nbmessages = ms.filter(m => !m.isRead).length; } });
  }

  getpicture(): string { return this.authservice.currentUser?.pdp || ''; }
  hasPhoto(): boolean { const p = this.authservice.currentUser?.pdp; return !!(p && p !== 'assets/44.png'); }
  getInitials(): string { const u = this.authservice.currentUser; return u ? (u.firstName?.[0]||'')+(u.lastName?.[0]||'') : '?'; }
  getloggeduser(): string { return this.authservice.currentUser?.firstName || ''; }
  getiduser() { return this.authservice.currentUser?.id; }
  isAdmin(): boolean { return !!this.authservice.currentUser?.isAdmin; }
  refreshHomePage(): void { this.router.url.includes('acceuil') ? location.reload() : this.router.navigate(['acceuil']); }
  logout(): void { this.router.navigate(['connexion']); }
  getFavorite(): void { this.router.navigate(['favorites']); }
  getMessages(): void { this.router.navigate(['messages']); }
  navigatToAdminPage(): void { this.router.navigate(['admin']); }
}

import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-auth-confirmation',
  templateUrl: './auth-confirmation.component.html',
  styleUrls: ['./auth-confirmation.component.css'],
})
export class AuthConfirmationComponent implements OnInit {
  @ViewChild('confirmationCodeInput') codeInput!: ElementRef;

  email   = '';
  errmsg  = '';
  confirmmsg = false;
  resent  = false;

  constructor(private http: HttpClient, private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.params.subscribe(p => { this.email = p['email'] || ''; });
  }

  onSubmitConfirmation(): void {
    const code = this.codeInput?.nativeElement?.value?.trim();
    if (!code) { this.errmsg = 'Veuillez entrer le code reçu.'; return; }
    this.errmsg = '';

    this.http.get(`http://localhost:5000/api/${this.email}`).subscribe({
      next: (userData: any) => {
        if (userData.isConfirmed) {
          this.router.navigate(['/connexion']);
          return;
        }
        if (code === userData.confirmcode) {
          this.confirmmsg = true;
          this.http.post(`http://localhost:5000/api/users/${userData.id}/confirm`, {}).subscribe({
            next: () => { setTimeout(() => this.router.navigate(['/connexion']), 2000); },
          });
        } else {
          this.errmsg = 'Code incorrect. Vérifiez votre e-mail et réessayez.';
        }
      },
      error: () => { this.errmsg = 'Adresse e-mail introuvable.'; },
    });
  }

  resend(): void {
    this.http.post('http://localhost:5000/api/resend-confirmation', { email: this.email }).subscribe();
    this.resent = true;
  }
}

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth_service/auth.service';

@Component({
  selector: 'app-auth-view',
  templateUrl: './auth-view.component.html',
  styleUrls: ['./auth-view.component.css'],
})
export class AuthViewComponent implements OnInit {
  authform!: FormGroup;
  errorMsg = '';
  ShowSigninButton = false;
  ShowconfirmEmailButton = false;
  isLoading = false;
  showPwd = false;

  features = [
    { icon:'fa-solid fa-check', text:'100% gratuit, zéro transaction' },
    { icon:'fa-solid fa-check', text:'Communauté solidaire et bienveillante' },
    { icon:'fa-solid fa-check', text:'Messagerie sécurisée intégrée' },
    { icon:'fa-solid fa-check', text:'Don de vêtements, livres et plus' },
  ];

  constructor(
    private fb:          FormBuilder,
    private authService: AuthService,
    private router:      Router,
  ) {}

  ngOnInit(): void {
    this.authform = this.fb.group({
      email:    ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  onSubmitSignIn(): void {
    if (this.authform.invalid) return;
    this.isLoading = true;
    this.errorMsg  = '';
    this.authService.signIn(this.authform.value.email, this.authform.value.password).then(() => {
      this.isLoading = false;
      this.router.navigate(['acceuil']);
    }).catch((err: string) => {
      this.isLoading = false;
      this.errorMsg  = err;
      if (err.includes('inscrit'))   this.ShowSigninButton       = true;
      if (err.includes('confirmée')) this.ShowconfirmEmailButton = true;
    });
  }

  loginWithGoogle(): void {
    // Google OAuth popup — uses accounts.google.com
    const clientId = 'YOUR_GOOGLE_CLIENT_ID';
    const redirectUri = encodeURIComponent('http://localhost:4200/connexion');
    const scope = encodeURIComponent('openid email profile');
    const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=token&scope=${scope}`;
    const popup = window.open(url, 'google-login', 'width=500,height=600,left=400,top=100');

    // Listen for token from popup
    const timer = setInterval(() => {
      try {
        if (!popup || popup.closed) { clearInterval(timer); return; }
        const hash = popup.location.hash;
        if (hash && hash.includes('access_token')) {
          clearInterval(timer);
          popup.close();
          const params = new URLSearchParams(hash.substring(1));
          const token  = params.get('access_token');
          if (token) this.handleGoogleToken(token);
        }
      } catch(e) { /* cross-origin — wait */ }
    }, 500);
  }

  private handleGoogleToken(token: string): void {
    // Fetch user info from Google
    fetch(`https://www.googleapis.com/oauth2/v3/userinfo?access_token=${token}`)
      .then(r => r.json())
      .then(info => {
        // Auto-login or create account
        this.authService.signInWithGoogle(info).then(() => {
          this.router.navigate(['acceuil']);
        }).catch((err: string) => { this.errorMsg = err || 'Erreur connexion Google'; });
      });
  }

  navigateToSignup():                void { this.router.navigate(['signup']); }
  navigateToconfirmEmail():          void { this.router.navigate(['confirmation', this.authform.value.email]); }
  navigateToforgotpassworcomponent():void { this.router.navigate(['forgotpassword']); }
}

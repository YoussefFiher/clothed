import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ErrorViewComponent } from './views/error-view/error-view.component';
import { HeaderComponent } from './composant/header/header.component';
import { HomeComponent } from './composant/home/home.component';
import { AuthViewComponent } from './views/auth-view/auth-view.component';
import { AccueilViewComponent } from './views/accueil-view/accueil-view.component';
import { AuthGuardService } from './services/auth-guard_service/auth-guard.service';
import { SignupComponent } from './composant/signup/signup.component';
import { ProfilComponent } from './composant/profil/profil.component';
import { ArticleViewComponent } from './views/article_view/article-view.component';
import { ArticleDetailComponent } from './composant/article-detail/article-detail.component';
import { FavoritesComponent } from './composant/favorites/favorites.component';
import { CurrentUserProfilComponent } from './composant/current-user-profil/current-user-profil.component';
import { MessageViewComponent } from './views/message-view/message-view.component';
import { AdminComponent } from './composant/admin/admin.component';
import { AuthConfirmationComponent } from './composant/auth-confirmation/auth-confirmation.component';
import { ForgotpasswordComponent } from './composant/forgotpassword/forgotpassword.component';

const routes: Routes = [ 
  { path: '', component: HomeComponent },
  {path:'connexion',component: AuthViewComponent},
  {path : 'confirmation/:email',component: AuthConfirmationComponent},
  {path : 'forgotpassword',component:ForgotpasswordComponent},
  {path : 'acceuil',canActivate:[AuthGuardService],component:AccueilViewComponent},
  { path: 'acceuil/:searchTerm', canActivate: [AuthGuardService], component: AccueilViewComponent },
  {path : 'signup',component:SignupComponent},
  {path:'profil/:userId',canActivate:[AuthGuardService],component :ProfilComponent},
  {path:'admin',canActivate:[AuthGuardService],component:AdminComponent},
  {path:'article' ,canActivate:[AuthGuardService],component:ArticleViewComponent},
  {path :'favorites',canActivate:[AuthGuardService],component:FavoritesComponent},
  {path :'messages',canActivate:[AuthGuardService],component:MessageViewComponent},
  {path : 'currentuserprofil/:id',canActivate: [AuthGuardService], component:CurrentUserProfilComponent },
  { path: 'error', component: ErrorViewComponent }, 
  { path: 'article/:id', component:ArticleDetailComponent },
  { path: '**', redirectTo: '/error' }, 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

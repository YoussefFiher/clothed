import { NgModule } from '@angular/core';
import { AcceuilHeaderComponent } from './composant/acceuil-header/acceuil-header.component';
import { HeaderComponent } from './composant/header/header.component';
import { FooterComponent } from './composant/footer/footer.component';
import { MatDialogModule } from '@angular/material/dialog';
import { BrowserModule } from '@angular/platform-browser';
import {HttpClientModule} from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeViewComponent } from './composant/home-view/home-view.component';
import { ErrorViewComponent } from './views/error-view/error-view.component';
import { HomeComponent } from './composant/home/home.component';
import { AuthViewComponent } from './views/auth-view/auth-view.component';
import { AuthService } from './services/auth_service/auth.service';
import { AccueilViewComponent } from './views/accueil-view/accueil-view.component';
import { AuthGuardService } from './services/auth-guard_service/auth-guard.service';
import { ArticlesComponent } from './composant/articles/articles.component';
import { ArticleService } from './services/article_service/article.service';
import { FormsModule} from '@angular/forms';
import { SignupComponent } from './composant/signup/signup.component';
import { ProfilComponent } from './composant/profil/profil.component';
import { UserService } from './services/user/user.service';
import { ArticleViewComponent } from './views/article_view/article-view.component';
import { NavigateService } from './services/navigate_service/navigate.service';
import { ArticleDetailComponent } from './composant/article-detail/article-detail.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbCarouselModule } from '@ng-bootstrap/ng-bootstrap';
import { FavoritesComponent } from './composant/favorites/favorites.component';
import { FavoritesService } from './services/favorites_service/favorites.service';
import { ReactiveFormsModule } from '@angular/forms';
import { MessageService } from './services/message_service/message.service';
import { CurrentUserProfilComponent } from './composant/current-user-profil/current-user-profil.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MessageDialogComponent } from './composant/message-dialog/message-dialog.component';
import { MessageViewComponent } from './views/message-view/message-view.component';
import { MessageDomDialogComponent } from './composant/message-dom-dialog/message-dom-dialog.component';
import { RespondingDialogComponent } from './composant/responding-dialog/responding-dialog.component';
import { AcceptDemandDialogComponent } from './composant/accept-demand-dialog/accept-demand-dialog.component';
import { AdminComponent } from './composant/admin/admin.component';
import { AuthConfirmationComponent } from './composant/auth-confirmation/auth-confirmation.component';
import { ForgotpasswordComponent } from './composant/forgotpassword/forgotpassword.component';




@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    AcceuilHeaderComponent,
    HomeViewComponent,
    ErrorViewComponent,
    HomeComponent,
    AccueilViewComponent,
    AuthViewComponent,
    ArticlesComponent,
    SignupComponent,
    ProfilComponent,
    ArticleViewComponent,
    ArticleDetailComponent,
    FavoritesComponent,
    CurrentUserProfilComponent,
    MessageDialogComponent,
    MessageViewComponent,
    MessageDomDialogComponent,
    RespondingDialogComponent,
    AcceptDemandDialogComponent,
    AdminComponent,
    AuthConfirmationComponent,
    ForgotpasswordComponent,
  ],
  imports: [
    MatDialogModule,
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    NgbCarouselModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    MatDialogModule,
  ],
  providers: [AuthService,AuthGuardService,ArticleService,UserService,NavigateService,FavoritesService,MessageService],
  bootstrap: [AppComponent]
})
export class AppModule { }

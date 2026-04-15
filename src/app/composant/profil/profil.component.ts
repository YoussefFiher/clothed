import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Article } from 'src/app/models/articles.model';
import { ArticleService } from 'src/app/services/article_service/article.service';
import { UserService } from 'src/app/services/user/user.service';
import { FavoritesService } from 'src/app/services/favorites_service/favorites.service';
import { AuthService } from 'src/app/services/auth_service/auth.service';

const COLORS = ['#16a34a','#2563eb','#7c3aed','#d97706','#dc2626','#0891b2','#db2777'];

@Component({
  selector: 'app-profil',
  templateUrl: './profil.component.html',
  styleUrls: ['./profil.component.css']
})
export class ProfilComponent implements OnInit {
  profil_userId = -1;
  userArticles: Article[] = [];
  Articles: Article[] = [];
  userName = '';
  nbarticles = 0;
  userPdp = '';
  userVille = '';
  favorites: any[] = [];
  avatarColor = COLORS[0];

  constructor(
    private route: ActivatedRoute,
    private articleService: ArticleService,
    private userService: UserService,
    private favoritesService: FavoritesService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.profil_userId = Number(params['userId']);
      this.avatarColor = COLORS[this.profil_userId % COLORS.length];
      this.loadUserArticles();
      this.loadFavorites();
    });
  }

  loadFavorites(): void {
    this.favoritesService.getFavorites().subscribe({
      next: (favs: any[]) => { this.favorites = favs; }
    });
  }

  loadUserArticles(): void {
    this.articleService.getArticlesByUserId(this.profil_userId).subscribe({
      next: (articles) => {
        this.Articles = articles;
        this.nbarticles = articles.length;
        this.userArticles = articles.filter(a => a.statut !== 'retenu');
        this.getUserInfo(this.profil_userId);
      }
    });
  }

  getUserInfo(id: number): void {
    this.userService.getUserByID(id).subscribe({
      next: (user) => {
        this.userName = user?.firstName || '';
        this.userPdp = user?.pdp || '';
        this.userVille = user?.city || '';
      }
    });
  }

  onHeartClick(article: Article): void {
    const userId = this.authService.currentUser?.id;
    if (!userId) return;
    this.favoritesService.addToFavorites(article, userId).subscribe({
      next: () => {
        this.favoritesService.getFavorites().subscribe({
          next: (favs: any[]) => { this.favorites = favs.filter(f => f.userId === userId); }
        });
      }
    });
  }

  isFavorite(article: Article): boolean {
    return this.favorites.some(f => f.articleId === article.id);
  }

  resolveImg(raw: any): string | null {
    if (!raw || typeof raw !== 'string') return null;
    if (raw.startsWith('http') || raw.startsWith('data:')) return raw;
    return '/assets/' + raw;
  }

  GetFirstImageUrl(article: Article): string | null {
    return this.resolveImg(article.images?.[0]);
  }

  statusLabel(s: string): string {
    return {libre:'Disponible', retenu:'Retenu', 'donné':'Donné', 'donne':'Donné'}[s] || s;
  }

  getNumberOfArticles(a: any[]): void { this.nbarticles = a.length; }
  getFavoriteCount(): number {
    return this.favorites.filter(f => this.Articles.some(a => a.id === f.articleId)).length;
  }
}

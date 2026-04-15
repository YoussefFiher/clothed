import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Article } from '../../models/articles.model';
import { FavoritesService } from '../../services/favorites_service/favorites.service';
import { AuthService } from '../../services/auth_service/auth.service';
import { ArticleService } from '../../services/article_service/article.service';

const COLORS = ['#16a34a','#2563eb','#7c3aed','#d97706','#dc2626','#0891b2','#db2777'];

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.css']
})
export class FavoritesComponent implements OnInit {
  favoriteArticles: Article[] = [];
  loading = true;

  constructor(
    private favoritesService: FavoritesService,
    private authService: AuthService,
    private articleService: ArticleService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.load();
  }

  private load(): void {
    this.loading = true;
    const userId = this.authService.currentUser?.id;
    if (!userId) { this.loading = false; return; }

    this.favoritesService.getFavorites().subscribe({
      next: (favs: any[]) => {
        const ids = favs.filter(f => f.userId === userId).map(f => f.articleId);
        if (ids.length === 0) { this.favoriteArticles = []; this.loading = false; return; }
        this.articleService.getArticlesByIds(ids).subscribe({
          next: (arts) => { this.favoriteArticles = arts; this.loading = false; },
          error: () => { this.loading = false; }
        });
      },
      error: () => { this.loading = false; }
    });
  }

  removeArticle(article: Article): void {
    const userId = this.authService.currentUser?.id;
    if (!userId) return;
    this.favoritesService.addToFavorites(article, userId).subscribe({
      next: () => { this.favoriteArticles = this.favoriteArticles.filter(a => a.id !== article.id); }
    });
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

  avatarColor(id: number): string { return COLORS[id % COLORS.length]; }
  goDetail(id: number): void { this.router.navigate(['article', id]); }
  goProfile(id: number): void { this.router.navigate(['profil', id]); }
  Home_navigate(): void { this.router.navigate(['acceuil']); }
  navigateToDonateurProfile(id: number): void { this.router.navigate(['profil', id]); }
}

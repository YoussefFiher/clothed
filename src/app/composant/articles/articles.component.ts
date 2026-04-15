import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Article } from 'src/app/models/articles.model';
import { ArticleService } from 'src/app/services/article_service/article.service';
import { AuthService } from 'src/app/services/auth_service/auth.service';
import { FavoritesService } from 'src/app/services/favorites_service/favorites.service';

const COLORS = ['#16a34a','#2563eb','#7c3aed','#d97706','#dc2626','#0891b2','#db2777'];

@Component({ selector:'app-articles', templateUrl:'./articles.component.html', styleUrls:['./articles.component.css'] })
export class ArticlesComponent implements OnInit {
  @Input() articles: Article[] = [];
  favs: any[] = [];

  constructor(
    private articleSvc: ArticleService,
    private authSvc:    AuthService,
    private favsSvc:    FavoritesService,
    private router:     Router,
  ) {}

  ngOnInit(): void {
    this.articleSvc.getArticles().subscribe({ next: arts => {
      const uid = this.authSvc.currentUser?.id;
      this.articles = uid ? arts.filter(a => a.user.id !== uid && a.statut !== 'retenu') : arts;
    }});
    this.loadFavs();
  }

  private loadFavs(): void {
    const uid = this.authSvc.currentUser?.id;
    if (!uid) return;
    this.favsSvc.getFavorites().subscribe({ next: (f: any[]) => { this.favs = f.filter(x => x.userId === uid); }});
  }

  resolveImg(raw: any): string | null {
    if (!raw || typeof raw !== 'string') return null;
    if (raw.startsWith('http') || raw.startsWith('data:')) return raw;
    return '/assets/' + raw;
  }

  isFav(a: Article): boolean { return this.favs.some(f => f.articleId === a.id); }
  toggleFav(a: Article): void {
    const uid = this.authSvc.currentUser?.id;
    if (!uid) return;
    this.favsSvc.addToFavorites(a, uid).subscribe({ next: () => this.loadFavs() });
  }
  statusLabel(s: string): string { return ({libre:'Disponible',retenu:'Retenu','donné':'Donné',donne:'Donné'} as any)[s]||s; }
  avatarColor(id: number): string { return COLORS[id % COLORS.length]; }
  go(id: number): void { this.router.navigate(['article', id]); }
  goProfile(id: number): void { this.router.navigate(['profil', id]); }
}

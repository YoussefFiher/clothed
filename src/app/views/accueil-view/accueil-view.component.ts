import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Article } from 'src/app/models/articles.model';
import { ArticleService } from 'src/app/services/article_service/article.service';
import { AuthService } from 'src/app/services/auth_service/auth.service';

@Component({
  selector: 'app-accueil-view',
  templateUrl: './accueil-view.component.html',
  styleUrls: ['./accueil-view.component.css'],
})
export class AccueilViewComponent implements OnInit {
  all:      Article[] = [];
  filtered: Article[] = [];
  noArticle = false;
  loading   = true;
  searchTerm = '';
  activeType = '';
  activeSub  = '';
  toast      = '';
  toastTimer: any;

  categories = [
    { name:'Homme',  label:'Homme',      subs:['Hauts et T-shirt','Pantalon','Manteaux et Vestes','Chaussures','Costumes'] },
    { name:'Femme',  label:'Femme',      subs:['Robe','Hauts','Sweats et Sweats a capuche','Pantalon et Leggings','Jupe','Chaussures'] },
    { name:'Enfant', label:'Enfant',     subs:['Hauts et T-shirt','Pantalon','Chaussures'] },
    { name:'Livre',  label:'Livres',     subs:['Roman','BD','Manga','Autres'] },
    { name:'Autres', label:'Accessoires',subs:null },
  ];

  constructor(
    private articleService: ArticleService,
    private authService: AuthService,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    const s = this.route.snapshot.paramMap.get('searchTerm');
    if (s) this.searchTerm = s;

    // Show toast if coming from article creation
    const nav = window.history.state;
    if (nav?.articleCreated) {
      this.showToast('🎉 Article publié avec succès !');
    }

    this.load();
  }

  private load(): void {
    const uid = this.authService.currentUser?.id;
    this.articleService.getArticles().subscribe({
      next: (arts) => {
        this.all = uid ? arts.filter(a => a.user.id !== uid && a.statut !== 'retenu') : arts;
        this.noArticle = this.all.length === 0;
        this.loading = false;
        this.applyFilters();
      },
      error: () => { this.loading = false; }
    });
  }

  applyFilters(): void {
    let list = [...this.all];
    if (this.activeType) list = list.filter(a => a.type === this.activeType);
    if (this.activeSub)  list = list.filter(a => a.sous_type === this.activeSub);
    if (this.searchTerm.trim()) {
      const t = this.searchTerm.toLowerCase();
      list = list.filter(a =>
        a.title.toLowerCase().includes(t) || a.description.toLowerCase().includes(t)
      );
    }
    this.filtered = list;
  }

  setType(t: string): void { this.activeType = t; this.activeSub = ''; this.applyFilters(); }
  setSub(s: string):  void { this.activeSub = s; this.applyFilters(); }
  clearSearch():      void { this.searchTerm = ''; this.applyFilters(); }
  resetFilters():     void { this.searchTerm = ''; this.activeType = ''; this.activeSub = ''; this.applyFilters(); }

  showToast(msg: string): void {
    this.toast = msg;
    clearTimeout(this.toastTimer);
    this.toastTimer = setTimeout(() => { this.toast = ''; }, 3500);
  }
}

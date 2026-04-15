import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ArticleService } from './article.service';
import { Article } from 'src/app/models/articles.model';
import { User } from 'src/app/models/user.model';

describe('ArticleService', () => {
  let service: ArticleService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports : [ HttpClientTestingModule]
    });
    service = TestBed.inject(ArticleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  const mockUser: User = { 
    id: 1, 
    firstName: 'John', 
    lastName: 'Doe', 
    email: 'john.doe@example.com', 
    password: 'password', 
    city: 'City', 
    address: 'Address', 
    pdp: 'pdp', 
    isAdmin: false, 
    confirmcode: 'confirmcode', 
    isConfirmed: true, 
    forgotPassword: 'forgotPassword' 
  };
  
  it('should get articles', () => {
    const mockArticles: Article[] = [{ id: 1, title: 'Article 1', type: 'Type 1', sous_type: 'Sous-Type 1', description: 'Description 1', statut: 'Statut 1', user: mockUser, images: [] }];
    service.getArticles().subscribe(articles => {
      expect(articles).toEqual(mockArticles);
    });

  });

  it('should filter articles by category', () => {
    const mockArticles: Article[] = [
      { id: 1, title: 'Article 1', type: 'Type 1', sous_type: 'Sous-Type 1', description: 'Description 1', statut: 'Statut 1', user: mockUser, images: [] },
      { id: 2, title: 'Article 2', type: 'Type 2', sous_type: 'Sous-Type 2', description: 'Description 2', statut: 'Statut 2', user: mockUser, images: [] },
      { id: 3, title: 'Article 3', type: 'Type 1', sous_type: 'Sous-Type 3', description: 'Description 3', statut: 'Statut 3', user: mockUser, images: [] }
    ];
    service.articles = mockArticles;

    const filteredArticles = service.filterArticles('Type 1');
    expect(filteredArticles.length).toBe(2);
    expect(filteredArticles[0]).toEqual(mockArticles[0]);
    expect(filteredArticles[1]).toEqual(mockArticles[2]);
  });

  

});
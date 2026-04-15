import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { FavoritesService } from './favorites.service';
import { Article } from 'src/app/models/articles.model';
import { User } from 'src/app/models/user.model';

describe('FavoritesService', () => {
  let service: FavoritesService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [FavoritesService]
    });
    service = TestBed.inject(FavoritesService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  //c'est la meme chose pour remove il suffit de faire encore une add
  it('should add an article to favorites successfully', () => {

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
  
    const mockArticle: Article = { 
      id: 1, 
      title: 'Test Article', 
      type: 'Test', 
      sous_type: 'Test', 
      description: 'Testing', 
      statut: 'Test', 
      user: mockUser, 
      images: [] 
    };
  

    service.addToFavorites(mockArticle, 1).subscribe(response => {
      expect(response).toBeTruthy();
    });

    const req = httpMock.expectOne('http://localhost:5000/addfavorite');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ articleId: mockArticle.id, userId: 1 });
    req.flush({});
  });

  
});

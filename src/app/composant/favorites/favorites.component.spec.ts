import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FavoritesComponent } from './favorites.component';
import { AcceuilHeaderComponent } from '../acceuil-header/acceuil-header.component';
import { RouterModule,ActivatedRoute} from '@angular/router';
import { Article } from 'src/app/models/articles.model';
import { User } from 'src/app/models/user.model';

describe('FavoritesComponent', () => {
  let component: FavoritesComponent;
  let fixture: ComponentFixture<FavoritesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FavoritesComponent,AcceuilHeaderComponent],
      imports: [HttpClientTestingModule,RouterModule],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: new Map().set('someKey', 'someValue')
            }
          }
        }
      ]
    });
    fixture = TestBed.createComponent(FavoritesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  it('should remove article from favorites', () => {
    const mockUser: User = {
      id: 1,
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      password: 'password123',
      city: 'City',
      address: 'Address',
      pdp: 'pdp.jpg',
      isAdmin: false,
      confirmcode: 'confirmationCode123',
      isConfirmed: true,
      forgotPassword: 'forgotPassword123'
    };
    const mockArticle: Article = {
      id: 0,
      images: [],
      title: '',
      type: '',
      sous_type: '',
      description: '',
      statut: '',
      user: mockUser
    };
    const removeArticleSpy = spyOn(component, 'removeArticle').and.callThrough();
  
    component.removeArticle(mockArticle);
  
    expect(removeArticleSpy).toHaveBeenCalledWith(mockArticle);
    
  });
  
  it('should navigate to donateur profile', () => {
    const userId = 123; 
    const navigateSpy = spyOn(component['router'], 'navigate').and.stub();
  
    component.navigateToDonateurProfile(userId);
  
    expect(navigateSpy).toHaveBeenCalledWith(['profil', userId]);
    
  });
  
  it('should get first image URL', () => {
    const mockUser: User = {
      id: 1,
      firstName: 'youssef',
      lastName: 'fiher',
      email: 'yousseffiher@example.com',
      password: 'password123',
      city: 'City',
      address: 'Address',
      pdp: 'pdp.jpg',
      isAdmin: false,
      confirmcode: 'confirmationCode123',
      isConfirmed: true,
      forgotPassword: 'forgotPassword123'
    };
    const mockArticle: Article = {
      images: ['image1.jpg', 'image2.jpg'],
      id: 0,
      title: '',
      type: '',
      sous_type: '',
      description: '',
      statut: '',
      user: mockUser
    };
    const imageUrl = component.GetFirstImageUrl(mockArticle);
  
    expect(imageUrl).toBeDefined();
    expect(imageUrl).toContain('image1.jpg');
    
  });
  
});

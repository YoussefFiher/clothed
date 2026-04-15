import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, ParamMap } from '@angular/router';
import { ProfilComponent } from './profil.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AcceuilHeaderComponent } from 'src/app/composant/acceuil-header/acceuil-header.component';
import { FooterComponent } from '../footer/footer.component';
import { BehaviorSubject, of } from 'rxjs';
import { RouterModule } from '@angular/router';
import { Article } from 'src/app/models/articles.model';
import { ArticleService } from 'src/app/services/article_service/article.service';
import { User } from 'src/app/models/user.model';


describe('ProfilComponent', () => {
  let component: ProfilComponent;
  let fixture: ComponentFixture<ProfilComponent>;
  let activatedRoute: BehaviorSubject<ParamMap>; // Déclaration de activatedRoute

  beforeEach(() => {
    
    activatedRoute = new BehaviorSubject<ParamMap>(convertToParamMap({ userId: '5' }));

    TestBed.configureTestingModule({
      declarations: [ProfilComponent,AcceuilHeaderComponent,FooterComponent],
      imports: [HttpClientTestingModule,RouterModule],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { 
            paramMap: activatedRoute.asObservable() 
          }
        }
      ]
    });
    fixture = TestBed.createComponent(ProfilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

});

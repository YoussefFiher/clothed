import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing'; 
import { ActivatedRoute, Router } from '@angular/router'; 
import { AccueilViewComponent } from './accueil-view.component';
import { AcceuilHeaderComponent } from 'src/app/composant/acceuil-header/acceuil-header.component';
import { ArticlesComponent } from 'src/app/composant/articles/articles.component';
import { FooterComponent } from 'src/app/composant/footer/footer.component';
import { RouterModule } from '@angular/router';
describe('AccueilViewComponent', () => {
  let component: AccueilViewComponent;
  let fixture: ComponentFixture<AccueilViewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AccueilViewComponent,AcceuilHeaderComponent,ArticlesComponent,FooterComponent],
      imports: [HttpClientTestingModule,RouterModule],
      providers: [
      
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: new Map().set('someKey', 'someValue') // Vous pouvez ajuster cela selon les besoins de votre test
            }
          }
        }
      ]
    });
    fixture = TestBed.createComponent(AccueilViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });



  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set searchTerm when applySearchFilter is called', () => {
    const searchTerm = 'test';
    spyOn(component, 'updateUrl'); // Mock the method updateUrl
    (document.querySelector('input[type="text"]') as HTMLInputElement).value = searchTerm;

    component.applySearchFilter();

    expect(component.searchTerm).toEqual(searchTerm);
  });

  it('should updateUrl when applySearchFilter is called', () => {
    spyOn(component, 'updateUrl'); 

    component.applySearchFilter();

    expect(component.updateUrl).toHaveBeenCalled();
  });

  it('should navigate when addArticle is called', () => {
    const routerSpy = spyOn(component.router, 'navigate');

    component.addArticle();

    expect(routerSpy).toHaveBeenCalledWith(['article']);
  });

});

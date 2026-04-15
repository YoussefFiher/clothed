import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ArticleDetailComponent } from './article-detail.component';
import { ActivatedRoute } from '@angular/router'; //
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AcceuilHeaderComponent } from '../acceuil-header/acceuil-header.component';
import { FooterComponent } from '../footer/footer.component';
import { RouterModule } from '@angular/router';
describe('ArticleDetailComponent', () => {
  let component: ArticleDetailComponent;
  let fixture: ComponentFixture<ArticleDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ArticleDetailComponent,AcceuilHeaderComponent,FooterComponent],
      imports: [HttpClientTestingModule,MatDialogModule,RouterModule],
      providers: [
        { provide: MatDialogRef, useValue: {} },
        { provide: MAT_DIALOG_DATA, useValue: {} },
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
    fixture = TestBed.createComponent(ArticleDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

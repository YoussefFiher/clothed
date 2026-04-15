import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule} from '@angular/common/http/testing';
import { ArticleViewComponent } from './article-view.component';
import { ReactiveFormsModule } from '@angular/forms';

describe('ArticleViewComponent', () => {
  let component: ArticleViewComponent;
  let fixture: ComponentFixture<ArticleViewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ArticleViewComponent],
      imports: [HttpClientTestingModule,ReactiveFormsModule]
    });
    fixture = TestBed.createComponent(ArticleViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

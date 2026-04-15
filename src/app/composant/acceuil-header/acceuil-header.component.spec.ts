import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AcceuilHeaderComponent } from './acceuil-header.component';
import { RouterModule, ActivatedRoute } from '@angular/router';
describe('AcceuilHeaderComponent', () => {
  let component: AcceuilHeaderComponent;
  let fixture: ComponentFixture<AcceuilHeaderComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AcceuilHeaderComponent],
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
    fixture = TestBed.createComponent(AcceuilHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

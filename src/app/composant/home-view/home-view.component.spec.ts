import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FooterComponent } from '../footer/footer.component';
import { HomeViewComponent } from './home-view.component';

describe('HomeViewComponent', () => {
  let component: HomeViewComponent;
  let fixture: ComponentFixture<HomeViewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HomeViewComponent,FooterComponent]
    });
    fixture = TestBed.createComponent(HomeViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

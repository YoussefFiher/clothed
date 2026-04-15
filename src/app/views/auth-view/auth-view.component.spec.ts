import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AuthViewComponent } from './auth-view.component';
import { HeaderComponent } from 'src/app/composant/header/header.component';
import { FooterComponent } from 'src/app/composant/footer/footer.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthService } from 'src/app/services/auth_service/auth.service';
import { UserService } from 'src/app/services/user/user.service';
import { NavigateService } from 'src/app/services/navigate_service/navigate.service';
import { of } from 'rxjs';
describe('AuthViewComponent', () => {
  let component: AuthViewComponent;
  let fixture: ComponentFixture<AuthViewComponent>;
  let authService: AuthService;
  let userService: UserService;
  let navigateService: NavigateService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AuthViewComponent,HeaderComponent,FooterComponent],
      imports: [HttpClientTestingModule,ReactiveFormsModule]
    });
    fixture = TestBed.createComponent(AuthViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should initialize form correctly', () => {
    expect(component.authform.get('email')).toBeTruthy();
    expect(component.authform.get('password')).toBeTruthy();
  });
});

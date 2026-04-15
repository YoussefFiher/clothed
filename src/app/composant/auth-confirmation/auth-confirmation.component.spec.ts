import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing'; 
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { AuthConfirmationComponent } from './auth-confirmation.component';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { of } from 'rxjs';

describe('AuthConfirmationComponent', () => {
  let component: AuthConfirmationComponent;
  let fixture: ComponentFixture<AuthConfirmationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AuthConfirmationComponent,HeaderComponent,FooterComponent],
      imports: [HttpClientTestingModule],
      providers : [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: convertToParamMap({ email: 'test@example.com' }) 
            }
          }
        }
      
      ]
    });
    fixture = TestBed.createComponent(AuthConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should initialize email from route params', () => {
    expect(component.email).toEqual('');
  });

  it('should not submit confirmation successfully with incorrect confirmation code', () => {
    
    component.onSubmitConfirmation();
  
    const httpClientSpy = jasmine.createSpyObj('HttpClient', ['get', 'post']);
    const expectedConfirmationCode = '123456'; 
    httpClientSpy.get.and.returnValue(of({ confirmcode :!expectedConfirmationCode, isConfirmed: false }));
    expect(component.confirmmsg).toBeFalse();
  });

});

import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthService } from './auth.service';
import { User } from '../../models/user.model';
import { of } from 'rxjs';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService]
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  
  it('should set user as not authenticated after sign-out', () => {
    service.isAuth = true;
    service.currentUser = { id: 1, firstName: 'John', lastName: 'Doe', email: 'john.doe@example.com', password: 'hashedPassword', city: '', address: '', pdp: '', isAdmin: false, confirmcode: '', isConfirmed: true, forgotPassword: '' };

    service.signOut();

    expect(service.isAuth).toBeFalse();
    expect(service.currentUser).toBeNull();
  });

  it('should retrieve users successfully', () => {
    const mockUsers: User[] = [
      { id: 1, firstName: 'John', lastName: 'Doe', email: 'john.doe@example.com', password: 'hashedPassword', city: '', address: '', pdp: '', isAdmin: false, confirmcode: '', isConfirmed: true, forgotPassword: '' },
      { id: 2, firstName: 'Jane', lastName: 'Doe', email: 'jane.doe@example.com', password: 'hashedPassword', city: '', address: '', pdp: '', isAdmin: false, confirmcode: '', isConfirmed: true, forgotPassword: '' }
    ];

    service.getusers().subscribe(users => {
      expect(users).toEqual(mockUsers);
    });

    const req = httpMock.expectOne('http://localhost:5000/api/users');
    expect(req.request.method).toBe('GET');
    req.flush(mockUsers);
  });

});

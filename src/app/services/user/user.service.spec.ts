import { TestBed, inject } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { UserService } from './user.service';
import { User } from '../../models/user.model';

describe('UserService', () => {
  let service: UserService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UserService]
    });
    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should retrieve a user by email', () => {
    const mockUser: User = { 
      id: 1, 
      firstName: 'jhon', 
      lastName: 'doe', 
      email: 'john.doe@example.com', 
      password: 'password123',
      city: 'Namur',
      address: 'Rue de bruxelles',
      pdp: 'profile.jpg',
      isAdmin: false,
      confirmcode: 'abc123',
      isConfirmed: false,
      forgotPassword: ''
    };

    service.getUserByEmail('john.doe@example.com').subscribe(user => {
      expect(user).toEqual(mockUser);
    });

    const req = httpMock.expectOne('http://localhost:5000/api/john.doe@example.com');
    expect(req.request.method).toBe('GET');
    req.flush(mockUser);
  });

  it('should retrieve a user by ID', () => {
    const mockUser: User = { 
      id: 1, 
      firstName: 'youssef', 
      lastName: 'Fiher', 
      email: 'youssef.fiher@example.com', 
      password: 'password123',
      city: 'Namur',
      address: 'Rue de bruxelles',
      pdp: 'profile.jpg',
      isAdmin: false,
      confirmcode: 'abc123',
      isConfirmed: false,
      forgotPassword: ''
    };

    service.getUserByID(1).subscribe(user => {
      expect(user).toEqual(mockUser);
    });

    const req = httpMock.expectOne('http://localhost:5000/api/users/1');
    expect(req.request.method).toBe('GET');
    req.flush(mockUser);
  });

  it('should add a new user', () => {
    const newUser: User = { 
      id: 1, 
      firstName: 'John', 
      lastName: 'Doe', 
      email: 'john.doe@example.com', 
      password: 'password123',
      city: 'New York',
      address: '123 Main St',
      pdp: 'profile.jpg',
      isAdmin: false,
      confirmcode: 'abc123',
      isConfirmed: false,
      forgotPassword: ''
    };

    service.addUser(newUser).subscribe(response => {
      expect(response).toBeTruthy();
    });

    const req = httpMock.expectOne('http://localhost:5000/api/users/signup');
    expect(req.request.method).toBe('POST');
    req.flush({});
  });

  it('should block a user', () => {
    const userToBlock: User = { 
      id: 1, 
      firstName: 'John', 
      lastName: 'Doe', 
      email: 'john.doe@example.com', 
      password: 'password123',
      city: 'New York',
      address: '123 Main St',
      pdp: 'profile.jpg',
      isAdmin: false,
      confirmcode: 'abc123',
      isConfirmed: false,
      forgotPassword: ''
    };

    service.blockUser(userToBlock).subscribe(blockedUser => {
      expect(blockedUser).toEqual(userToBlock);
    });

    const req = httpMock.expectOne('http://localhost:5000/api/users/delete');
    expect(req.request.method).toBe('POST');
    req.flush(userToBlock);
  });

});

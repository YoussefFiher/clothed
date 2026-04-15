import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SignupComponent } from './signup.component';
import { HeaderComponent } from '../header/header.component';
import { ReactiveFormsModule } from '@angular/forms';

describe('SignupComponent', () => {
  let component: SignupComponent;
  let fixture: ComponentFixture<SignupComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SignupComponent,HeaderComponent],
      imports: [HttpClientTestingModule,ReactiveFormsModule]
    });
    fixture = TestBed.createComponent(SignupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should invalidate the form when email format is incorrect', () => {
    const form = component.signUpForm;
    const emailControl = form.get('email');
    if (emailControl) {
      emailControl.setValue('invalid-email');
      expect(emailControl.errors?.['email']).toBeTruthy();
    } else {
      fail('Email control not found');
    }
  });

  
  

  //Ce test vise à vérifier si le formulaire d'inscription est invalide lorsque les champs obligatoires sont vides
  it('should invalidate the form when required fields are empty', () => {
    const form = component.signUpForm;
    expect(form.invalid).toBe(true);
    expect(form.get('firstname')?.errors?.['required']).toBeTruthy();
    expect(form.get('lastname')?.errors?.['required']).toBeTruthy();
    expect(form.get('email')?.errors?.['required']).toBeTruthy();
    expect(form.get('password')?.errors?.['required']).toBeTruthy();
    expect(form.get('passwordConfirmation')?.errors?.['required']).toBeTruthy();
    expect(form.get('ville')?.errors?.['required']).toBeTruthy();
    expect(form.get('address')?.errors?.['required']).toBeTruthy();
  });




});

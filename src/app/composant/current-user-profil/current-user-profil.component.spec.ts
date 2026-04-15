import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CurrentUserProfilComponent } from './current-user-profil.component';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AcceuilHeaderComponent } from '../acceuil-header/acceuil-header.component';
import { FooterComponent } from '../footer/footer.component';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule,ActivatedRoute } from '@angular/router';

describe('CurrentUserProfilComponent', () => {
  let component: CurrentUserProfilComponent;
  let fixture: ComponentFixture<CurrentUserProfilComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CurrentUserProfilComponent,AcceuilHeaderComponent,FooterComponent],
      imports: [HttpClientTestingModule,MatDialogModule,ReactiveFormsModule,RouterModule],
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
    fixture = TestBed.createComponent(CurrentUserProfilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should toggle editing', () => {
    expect(component.IsEditing).toBeFalse(); 
    component.toggleEditing('firstName');
    expect(component.IsEditing).toBeTrue(); 
    component.toggleEditing('firstName');
    expect(component.IsEditing).toBeFalse(); 
  });

});

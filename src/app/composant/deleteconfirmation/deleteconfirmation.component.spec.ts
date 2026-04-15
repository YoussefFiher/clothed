import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { DeleteconfirmationComponent } from './deleteconfirmation.component';

describe('DeleteconfirmationComponent', () => {
  let component: DeleteconfirmationComponent;
  let fixture: ComponentFixture<DeleteconfirmationComponent>;
  let dialogRefSpy: jasmine.SpyObj<MatDialogRef<DeleteconfirmationComponent>>;

  beforeEach(() => {
    const matDialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);

    TestBed.configureTestingModule({
      declarations: [DeleteconfirmationComponent],
      imports: [MatDialogModule],
      providers: [
        { provide: MatDialogRef, useValue: matDialogRefSpy },
        { provide: MAT_DIALOG_DATA, useValue: {} }
      ]
    });
    fixture = TestBed.createComponent(DeleteconfirmationComponent);
    component = fixture.componentInstance;
    dialogRefSpy = TestBed.inject(MatDialogRef) as jasmine.SpyObj<MatDialogRef<DeleteconfirmationComponent>>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should close dialog with false when onCancelClick is called', () => {
    component.onCancelClick();
    expect(dialogRefSpy.close).toHaveBeenCalledWith(false);
  });
  
  it('should close dialog with true when onConfirmClick is called', () => {
    component.onConfirmClick();
    expect(dialogRefSpy.close).toHaveBeenCalledWith(true);
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AcceptDemandDialogComponent } from './accept-demand-dialog.component';
import { ReactiveFormsModule } from '@angular/forms';

describe('AcceptDemandDialogComponent', () => {
  let component: AcceptDemandDialogComponent;
  let fixture: ComponentFixture<AcceptDemandDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AcceptDemandDialogComponent],
      imports : [HttpClientTestingModule,ReactiveFormsModule],
      providers: [
        { provide: MatDialogRef, useValue: {} },
        { provide: MAT_DIALOG_DATA, useValue: {} }
      ]
    });
    fixture = TestBed.createComponent(AcceptDemandDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

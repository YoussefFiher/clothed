import { ComponentFixture, TestBed, tick, fakeAsync } from '@angular/core/testing';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RespondingDialogComponent } from './responding-dialog.component';
import { AuthService } from 'src/app/services/auth_service/auth.service';
import { MessageService } from 'src/app/services/message_service/message.service';
import { of } from 'rxjs';

describe('RespondingDialogComponent', () => {
  let component: RespondingDialogComponent;
  let fixture: ComponentFixture<RespondingDialogComponent>;
  let mockDialogRef: MatDialogRef<RespondingDialogComponent>;
  let mockAuthService: AuthService;
  let mockMessageService: MessageService;


  beforeEach(async () => {
    mockDialogRef = jasmine.createSpyObj(['close']);
    mockAuthService = jasmine.createSpyObj(['currentUser']);
    mockMessageService = jasmine.createSpyObj(['sendMessage']);

    await TestBed.configureTestingModule({
      declarations: [RespondingDialogComponent],
      imports: [ReactiveFormsModule, HttpClientTestingModule],
      providers: [
        { provide: MatDialogRef, useValue: mockDialogRef },
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: AuthService, useValue: mockAuthService },
        { provide: MessageService, useValue: mockMessageService }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RespondingDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should close dialog on cancel click', () => {
    component.onCancelClick();
    expect(mockDialogRef.close).toHaveBeenCalled();
  });

});

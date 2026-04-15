import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ErrorViewComponent } from './error-view.component';

describe('ErrorViewComponent', () => {
  let component: ErrorViewComponent;
  let fixture: ComponentFixture<ErrorViewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ErrorViewComponent]
    });
    fixture = TestBed.createComponent(ErrorViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

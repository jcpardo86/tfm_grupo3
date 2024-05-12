import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormNewuserComponent } from './form-newuser.component';

describe('FormNewuserComponent', () => {
  let component: FormNewuserComponent;
  let fixture: ComponentFixture<FormNewuserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormNewuserComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FormNewuserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

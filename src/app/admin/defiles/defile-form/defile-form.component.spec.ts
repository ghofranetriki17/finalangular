import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DefileFormComponent } from './defile-form.component';

describe('DefileFormComponent', () => {
  let component: DefileFormComponent;
  let fixture: ComponentFixture<DefileFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DefileFormComponent]
    });
    fixture = TestBed.createComponent(DefileFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

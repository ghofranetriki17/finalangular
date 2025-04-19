import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DefilesComponent } from './defiles.component';

describe('DefilesComponent', () => {
  let component: DefilesComponent;
  let fixture: ComponentFixture<DefilesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DefilesComponent]
    });
    fixture = TestBed.createComponent(DefilesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DefilesListComponent } from './defiles-list.component';

describe('DefilesListComponent', () => {
  let component: DefilesListComponent;
  let fixture: ComponentFixture<DefilesListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DefilesListComponent]
    });
    fixture = TestBed.createComponent(DefilesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

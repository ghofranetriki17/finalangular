import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DesignersListComponent } from './designers-list.component';

describe('DesignersListComponent', () => {
  let component: DesignersListComponent;
  let fixture: ComponentFixture<DesignersListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DesignersListComponent]
    });
    fixture = TestBed.createComponent(DesignersListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DemandeStageComponent } from './demande-stage.component';

describe('DemandeStageComponent', () => {
  let component: DemandeStageComponent;
  let fixture: ComponentFixture<DemandeStageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DemandeStageComponent]
    });
    fixture = TestBed.createComponent(DemandeStageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

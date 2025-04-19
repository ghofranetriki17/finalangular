import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StagiaireFormComponent } from './stagiaire-form.component';

describe('StagiaireFormComponent', () => {
  let component: StagiaireFormComponent;
  let fixture: ComponentFixture<StagiaireFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StagiaireFormComponent]
    });
    fixture = TestBed.createComponent(StagiaireFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

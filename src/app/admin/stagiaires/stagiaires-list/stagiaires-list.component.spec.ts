import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StagiairesListComponent } from './stagiaires-list.component';

describe('StagiairesListComponent', () => {
  let component: StagiairesListComponent;
  let fixture: ComponentFixture<StagiairesListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StagiairesListComponent]
    });
    fixture = TestBed.createComponent(StagiairesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

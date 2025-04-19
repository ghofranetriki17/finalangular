import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DesignerFormComponent } from './designer-form.component';

describe('DesignerFormComponent', () => {
  let component: DesignerFormComponent;
  let fixture: ComponentFixture<DesignerFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DesignerFormComponent]
    });
    fixture = TestBed.createComponent(DesignerFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ManuscriptComponent } from './manuscript.component';

describe('ManuscriptComponent', () => {
  let component: ManuscriptComponent;
  let fixture: ComponentFixture<ManuscriptComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ManuscriptComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManuscriptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

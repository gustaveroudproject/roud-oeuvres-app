import { async, ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ManuscriptpartComponent } from './manuscriptpart.component';

describe('ManuscriptpartComponent', () => {
  let component: ManuscriptpartComponent;
  let fixture: ComponentFixture<ManuscriptpartComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ManuscriptpartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManuscriptpartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

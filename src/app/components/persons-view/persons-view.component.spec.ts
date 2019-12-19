import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonsViewComponent } from './persons-view.component';

describe('PersonsViewComponent', () => {
  let component: PersonsViewComponent;
  let fixture: ComponentFixture<PersonsViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PersonsViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonsViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

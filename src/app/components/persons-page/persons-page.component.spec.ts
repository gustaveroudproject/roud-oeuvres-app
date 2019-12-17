import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonsPageComponent } from './persons-page.component';

describe('PersonsPageComponent', () => {
  let component: PersonsPageComponent;
  let fixture: ComponentFixture<PersonsPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PersonsPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

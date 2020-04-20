import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlacePageComponent } from './place-page.component';

describe('PlacePageComponent', () => {
  let component: PlacePageComponent;
  let fixture: ComponentFixture<PlacePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlacePageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlacePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlaceMapComponent } from './place-map.component';

describe('PlaceMapComponent', () => {
  let component: PlaceMapComponent;
  let fixture: ComponentFixture<PlaceMapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlaceMapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlaceMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

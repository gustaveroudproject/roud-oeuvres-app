import { async, ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PlaceMapComponent } from './place-map.component';

describe('PlaceMapComponent', () => {
  let component: PlaceMapComponent;
  let fixture: ComponentFixture<PlaceMapComponent>;

  beforeEach(waitForAsync(() => {
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

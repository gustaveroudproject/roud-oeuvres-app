import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PubcPartSelectorComponent } from './pubc-part-selector.component';

describe('PubcPartSelectorComponent', () => {
  let component: PubcPartSelectorComponent;
  let fixture: ComponentFixture<PubcPartSelectorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PubcPartSelectorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PubcPartSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

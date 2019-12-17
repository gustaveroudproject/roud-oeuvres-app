import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ThingsPageComponent } from './things-page.component';

describe('ThingsPageComponent', () => {
  let component: ThingsPageComponent;
  let fixture: ComponentFixture<ThingsPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ThingsPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ThingsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

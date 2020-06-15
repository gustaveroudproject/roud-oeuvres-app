import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MsPageComponent } from './ms-page.component';

describe('MsPageComponent', () => {
  let component: MsPageComponent;
  let fixture: ComponentFixture<MsPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MsPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

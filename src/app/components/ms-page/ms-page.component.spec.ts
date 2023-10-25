import { async, ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MsPageComponent } from './ms-page.component';

describe('MsPageComponent', () => {
  let component: MsPageComponent;
  let fixture: ComponentFixture<MsPageComponent>;

  beforeEach(waitForAsync(() => {
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

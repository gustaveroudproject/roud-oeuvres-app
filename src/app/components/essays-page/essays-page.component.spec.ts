import { async, ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EssaysPageComponent } from './essays-page.component';

describe('EssaysPageComponent', () => {
  let component: EssaysPageComponent;
  let fixture: ComponentFixture<EssaysPageComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EssaysPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EssaysPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

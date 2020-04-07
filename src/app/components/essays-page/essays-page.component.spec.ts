import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EssaysPageComponent } from './essays-page.component';

describe('EssaysPageComponent', () => {
  let component: EssaysPageComponent;
  let fixture: ComponentFixture<EssaysPageComponent>;

  beforeEach(async(() => {
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

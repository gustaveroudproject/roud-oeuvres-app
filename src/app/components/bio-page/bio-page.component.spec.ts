import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BioPageComponent } from './bio-page.component';

describe('BioPageComponent', () => {
  let component: BioPageComponent;
  let fixture: ComponentFixture<BioPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BioPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BioPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

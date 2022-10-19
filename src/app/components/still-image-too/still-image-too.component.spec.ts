import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StillImageTooComponent } from './still-image-too.component';

describe('StillImageTooComponent', () => {
  let component: StillImageTooComponent;
  let fixture: ComponentFixture<StillImageTooComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StillImageTooComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StillImageTooComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

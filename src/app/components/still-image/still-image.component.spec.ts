import { async, ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { StillImageComponent } from './still-image.component';

describe('StillImageComponent', () => {
  let component: StillImageComponent;
  let fixture: ComponentFixture<StillImageComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ StillImageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StillImageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

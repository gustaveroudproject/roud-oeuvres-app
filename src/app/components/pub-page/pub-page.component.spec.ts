import { async, ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PubPageComponent } from './pub-page.component';

describe('PubPageComponent', () => {
  let component: PubPageComponent;
  let fixture: ComponentFixture<PubPageComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PubPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PubPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

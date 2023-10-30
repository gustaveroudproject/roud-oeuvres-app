import { async, ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PubcDiaryReusedPartComponent } from './pubc-diary-reused-part.component';

describe('PubcDiaryReusedPartComponent', () => {
  let component: PubcDiaryReusedPartComponent;
  let fixture: ComponentFixture<PubcDiaryReusedPartComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PubcDiaryReusedPartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PubcDiaryReusedPartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

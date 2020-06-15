import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PubcDiaryReusedPartComponent } from './pubc-diary-reused-part.component';

describe('PubcDiaryReusedPartComponent', () => {
  let component: PubcDiaryReusedPartComponent;
  let fixture: ComponentFixture<PubcDiaryReusedPartComponent>;

  beforeEach(async(() => {
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

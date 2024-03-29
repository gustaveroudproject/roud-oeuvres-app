import { async, ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PubcAvantTextsPartComponent } from './pubc-avant-texts-part.component';

describe('OrAvantTextsPartComponent', () => {
  let component: PubcAvantTextsPartComponent;
  let fixture: ComponentFixture<PubcAvantTextsPartComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PubcAvantTextsPartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PubcAvantTextsPartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

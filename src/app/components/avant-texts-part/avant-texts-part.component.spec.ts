import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrAvantTextsPartComponent } from './or-avant-texts-part.component';

describe('OrAvantTextsPartComponent', () => {
  let component: OrAvantTextsPartComponent;
  let fixture: ComponentFixture<OrAvantTextsPartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrAvantTextsPartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrAvantTextsPartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

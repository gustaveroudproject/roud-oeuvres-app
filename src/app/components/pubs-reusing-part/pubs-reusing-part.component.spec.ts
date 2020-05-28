import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PubsReusingPartComponent } from './pubs-reusing-part.component';

describe('PubsReusingPartComponent', () => {
  let component: PubsReusingPartComponent;
  let fixture: ComponentFixture<PubsReusingPartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PubsReusingPartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PubsReusingPartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

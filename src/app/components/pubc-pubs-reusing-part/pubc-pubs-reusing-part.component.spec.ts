import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PubcPubsReusingPartComponent } from './pubc-pubs-reusing-part.component';

describe('PubcPubsReusingPartComponent', () => {
  let component: PubcPubsReusingPartComponent;
  let fixture: ComponentFixture<PubcPubsReusingPartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PubcPubsReusingPartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PubcPubsReusingPartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

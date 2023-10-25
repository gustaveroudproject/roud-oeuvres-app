import { async, ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PubcPubsReusedPartComponent } from './pubc-pubs-reused-part.component';

describe('PubcPubsReusedPartComponent', () => {
  let component: PubcPubsReusedPartComponent;
  let fixture: ComponentFixture<PubcPubsReusedPartComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PubcPubsReusedPartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PubcPubsReusedPartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

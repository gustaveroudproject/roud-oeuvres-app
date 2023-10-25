import { async, ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MscPubsReusingPartComponent } from './msc-pubs-reusing-part.component';

describe('MscPubsReusingPartComponent', () => {
  let component: MscPubsReusingPartComponent;
  let fixture: ComponentFixture<MscPubsReusingPartComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MscPubsReusingPartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MscPubsReusingPartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

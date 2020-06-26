import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MscPubsReusingPartComponent } from './msc-pubs-reusing-part.component';

describe('MscPubsReusingPartComponent', () => {
  let component: MscPubsReusingPartComponent;
  let fixture: ComponentFixture<MscPubsReusingPartComponent>;

  beforeEach(async(() => {
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

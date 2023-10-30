import { async, ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MscMssRewrittenPartComponent } from './msc-mss-rewritten-part.component';

describe('MscMssRewrittenPartComponent', () => {
  let component: MscMssRewrittenPartComponent;
  let fixture: ComponentFixture<MscMssRewrittenPartComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MscMssRewrittenPartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MscMssRewrittenPartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

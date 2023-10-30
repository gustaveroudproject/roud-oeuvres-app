import { async, ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MscMssRewritingPartComponent } from './msc-mss-rewriting-part.component';

describe('MscMssRewritingPartComponent', () => {
  let component: MscMssRewritingPartComponent;
  let fixture: ComponentFixture<MscMssRewritingPartComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MscMssRewritingPartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MscMssRewritingPartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

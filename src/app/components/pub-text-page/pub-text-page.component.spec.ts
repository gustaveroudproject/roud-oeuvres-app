import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PubTextPageComponent } from './pub-text-page.component';

describe('PubTextPageComponent', () => {
  let component: PubTextPageComponent;
  let fixture: ComponentFixture<PubTextPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PubTextPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PubTextPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

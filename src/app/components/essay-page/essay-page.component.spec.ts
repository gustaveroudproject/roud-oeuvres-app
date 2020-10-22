import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EssayPageComponent } from './essay-page.component';

describe('EssayPageComponent', () => {
  let component: EssayPageComponent;
  let fixture: ComponentFixture<EssayPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EssayPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EssayPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

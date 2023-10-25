import { async, ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TextsPageComponent } from './texts-page.component';

describe('TextsPageComponent', () => {
  let component: TextsPageComponent;
  let fixture: ComponentFixture<TextsPageComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TextsPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TextsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

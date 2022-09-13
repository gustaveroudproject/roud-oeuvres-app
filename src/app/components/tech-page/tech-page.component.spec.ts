import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TechPageComponent } from './tech-page.component';

describe('TechPageComponent', () => {
  let component: TechPageComponent;
  let fixture: ComponentFixture<TechPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TechPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TechPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

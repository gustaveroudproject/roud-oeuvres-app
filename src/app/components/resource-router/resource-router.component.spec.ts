import { async, ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ResourceRouterComponent } from './resource-router.component';

describe('ResourceRouterComponent', () => {
  let component: ResourceRouterComponent;
  let fixture: ComponentFixture<ResourceRouterComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ResourceRouterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResourceRouterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

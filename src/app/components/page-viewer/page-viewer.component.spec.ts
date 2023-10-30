import { async, ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PageViewerComponent } from './page-viewer.component';

describe('PageViewerComponent', () => {
  let component: PageViewerComponent;
  let fixture: ComponentFixture<PageViewerComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PageViewerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PageViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

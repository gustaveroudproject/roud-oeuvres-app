import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArchiveResultsPageComponent } from './archive-results-page.component';

describe('ArchiveResultsPageComponent', () => {
  let component: ArchiveResultsPageComponent;
  let fixture: ComponentFixture<ArchiveResultsPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArchiveResultsPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArchiveResultsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

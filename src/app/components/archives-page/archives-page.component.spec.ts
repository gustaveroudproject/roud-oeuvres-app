import { async, ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ArchivesPageComponent } from './archives-page.component';

describe('ArchivesPageComponent', () => {
  let component: ArchivesPageComponent;
  let fixture: ComponentFixture<ArchivesPageComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ArchivesPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArchivesPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

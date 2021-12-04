import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EssayPhotoComponent } from './essay-photo.component';

describe('EssayPhotoComponent', () => {
  let component: EssayPhotoComponent;
  let fixture: ComponentFixture<EssayPhotoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EssayPhotoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EssayPhotoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

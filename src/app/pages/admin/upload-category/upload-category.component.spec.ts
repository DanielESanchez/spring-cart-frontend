import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadCategoryComponent } from './upload-category.component';

describe('UploadCategoryComponent', () => {
  let component: UploadCategoryComponent;
  let fixture: ComponentFixture<UploadCategoryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UploadCategoryComponent]
    });
    fixture = TestBed.createComponent(UploadCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

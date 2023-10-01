import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoryListAdminComponent } from './category-list-admin.component';

describe('CategoryListAdminComponent', () => {
  let component: CategoryListAdminComponent;
  let fixture: ComponentFixture<CategoryListAdminComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CategoryListAdminComponent]
    });
    fixture = TestBed.createComponent(CategoryListAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

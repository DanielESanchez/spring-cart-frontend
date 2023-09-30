import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductListAdminComponent } from './product-list-admin.component';

describe('ProductListAdminComponent', () => {
  let component: ProductListAdminComponent;
  let fixture: ComponentFixture<ProductListAdminComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProductListAdminComponent]
    });
    fixture = TestBed.createComponent(ProductListAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

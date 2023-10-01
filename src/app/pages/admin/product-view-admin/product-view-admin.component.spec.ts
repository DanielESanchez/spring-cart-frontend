import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductViewAdminComponent } from './product-view-admin.component';

describe('ProductViewAdminComponent', () => {
  let component: ProductViewAdminComponent;
  let fixture: ComponentFixture<ProductViewAdminComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProductViewAdminComponent]
    });
    fixture = TestBed.createComponent(ProductViewAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

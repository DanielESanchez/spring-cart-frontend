import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListUsersAdminComponent } from './list-users-admin.component';

describe('ListUsersAdminComponent', () => {
  let component: ListUsersAdminComponent;
  let fixture: ComponentFixture<ListUsersAdminComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListUsersAdminComponent]
    });
    fixture = TestBed.createComponent(ListUsersAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

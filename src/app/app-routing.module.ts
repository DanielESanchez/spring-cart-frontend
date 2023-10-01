import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/public/login/login.component';
import { RegisterComponent } from './pages/public/register/register.component';
import { HomeComponent } from './pages/home/home.component';
import { UploadProductComponent } from './pages/admin/upload-product/upload-product.component';
import { UploadCategoryComponent } from './pages/admin/upload-category/upload-category.component';
import { ProductListAdminComponent } from './pages/admin/list-products-admin/product-list-admin.component';
import { ProductViewAdminComponent } from './pages/admin/product-view-admin/product-view-admin.component';
import { CategoryListAdminComponent } from './pages/admin/list-categories-admin/category-list-admin.component';
import { UpdateCategoryComponent } from './pages/admin/update-category/update-category.component';
import { UpdateProductComponent } from './pages/admin/update-product/update-product.component';
import { ListProductsComponent } from './pages/public/list-products/list-products.component';
import { ViewProductComponent } from './pages/public/view-product/view-product.component';
import { UserOrdersComponent } from './pages/user/user-orders/user-orders.component';
import { AdminOrdersComponent } from './pages/admin/admin-orders/admin-orders.component';
import { SearchProductComponent } from './pages/public/search-product/search-product.component';
import { ListUsersAdminComponent } from './pages/admin/list-users-admin/list-users-admin.component';
import { adminGuard } from './guards/admin.guard';
import { userGuard } from './guards/user.guard';

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'register',
    component: RegisterComponent
  },
  {
    path: 'new-product',
    component: UploadProductComponent,
    canActivate: [adminGuard]
  },
  {
    path: 'new-category',
    component: UploadCategoryComponent,
    canActivate: [adminGuard]
  },
  {
    path: 'admin-products',
    component: ProductListAdminComponent,
    canActivate: [adminGuard]
  },
  {
    path: 'admin-categories',
    component: CategoryListAdminComponent,
    canActivate: [adminGuard]
  },
  {
    path: 'admin-users',
    component: ListUsersAdminComponent,
    canActivate: [adminGuard]
  },
  {
    path: 'admin-view-product/:id',
    component: ProductViewAdminComponent,
    canActivate: [adminGuard]
  },
  {
    path: 'admin-orders',
    component: AdminOrdersComponent,
    canActivate: [adminGuard]
  },
  {
    path: 'edit-category/:id',
    component: UpdateCategoryComponent,
    canActivate: [adminGuard]
  },
  {
    path: 'edit-product/:id',
    component: UpdateProductComponent,
    canActivate: [adminGuard]
  },
  {
    path: 'view-product/:id',
    component: ViewProductComponent
  },
  {
    path: 'user-orders',
    component: UserOrdersComponent,
    canActivate: [userGuard]
  },
  {
    path: 'search',
    component: SearchProductComponent
  },
  {
    path: '',
    component: ListProductsComponent
  },
  {
    path: '**',
    component: ListProductsComponent
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

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
    component: UploadProductComponent
  },
  {
    path: 'new-category',
    component: UploadCategoryComponent
  },
  {
    path: 'admin-products',
    component: ProductListAdminComponent
  },
  {
    path: 'admin-categories',
    component: CategoryListAdminComponent
  },
  {
    path: 'admin-view-product/:id',
    component: ProductViewAdminComponent,
  },
  {
    path: 'admin-orders',
    component: AdminOrdersComponent,
  },
  {
    path: 'edit-category/:id',
    component: UpdateCategoryComponent,
  },
  {
    path: 'edit-product/:id',
    component: UpdateProductComponent,
  },
  {
    path: 'view-product/:id',
    component: ViewProductComponent
  },
  {
    path: 'user-orders',
    component: UserOrdersComponent
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

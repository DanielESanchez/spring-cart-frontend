import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { HomeComponent } from './pages/home/home.component';
import { UploadProductComponent } from './pages/upload-product/upload-product.component';
import { UploadCategoryComponent } from './pages/upload-category/upload-category.component';
import { ProductListAdminComponent } from './pages/product-list-admin/product-list-admin.component';
import { ProductViewAdminComponent } from './pages/product-view-admin/product-view-admin.component';
import { CategoryListAdminComponent } from './pages/category-list-admin/category-list-admin.component';
import { UpdateCategoryComponent } from './pages/update-category/update-category.component';

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
    path: 'edit-category/:id',
    component: UpdateCategoryComponent,
  },
  {
    path: '**',
    component: HomeComponent
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from "@angular/forms";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CookieService } from 'ngx-cookie-service';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from "./components/navbar/navbar.component";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { LoginComponent } from "./pages/login/login.component";

import { MenubarModule } from 'primeng/menubar';
import { InputTextModule } from "primeng/inputtext";
import { DataViewModule } from 'primeng/dataview';
import { ButtonModule } from "primeng/button";
import { PasswordModule } from "primeng/password";
import { DividerModule } from "primeng/divider";
import { CheckboxModule } from 'primeng/checkbox';
import { RadioButtonModule } from 'primeng/radiobutton';
import { CardModule } from 'primeng/card';
import { KeyFilterModule } from 'primeng/keyfilter';
import { DropdownModule } from 'primeng/dropdown';
import { TableModule } from "primeng/table";
import { FileUploadModule } from 'primeng/fileupload';
import { InputNumberModule } from 'primeng/inputnumber';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { MessagesModule } from 'primeng/messages';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { MultiSelectModule } from 'primeng/multiselect';
import { BadgeModule } from 'primeng/badge';
import { TagModule } from "primeng/tag";
import { RatingModule } from "primeng/rating";
import { RegisterComponent } from './pages/register/register.component';
import { HomeComponent } from './pages/home/home.component';
import { UploadProductComponent } from './pages/upload-product/upload-product.component';
import { UploadCategoryComponent } from './pages/upload-category/upload-category.component';
import { HeaderInterceptorService } from './services/auth-service/header-interceptor.service';
import { ProductListAdminComponent } from './pages/product-list-admin/product-list-admin.component';
import { PaginatorModule } from 'primeng/paginator';
import { TooltipModule } from "primeng/tooltip";
import { GalleriaModule } from "primeng/galleria";
import { ImageModule } from "primeng/image";
import { ProductViewAdminComponent } from './pages/product-view-admin/product-view-admin.component';
import { CategoryListAdminComponent } from './pages/category-list-admin/category-list-admin.component';
import { UpdateCategoryComponent } from './pages/update-category/update-category.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    UploadProductComponent,
    UploadCategoryComponent,
    ProductListAdminComponent,
    ProductViewAdminComponent,
    CategoryListAdminComponent,
    UpdateCategoryComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    MenubarModule,
    ToastModule,
    MessagesModule,
    BrowserAnimationsModule,
    BadgeModule,
    InputTextModule,
    DataViewModule,
    ButtonModule,
    PasswordModule,
    DividerModule,
    CheckboxModule,
    RadioButtonModule,
    CardModule,
    KeyFilterModule,
    DropdownModule,
    TableModule,
    FileUploadModule,
    InputNumberModule,
    DynamicDialogModule,
    InputTextareaModule,
    FormsModule,
    MultiSelectModule,
    TagModule,
    RatingModule,
    PaginatorModule,
    TooltipModule,
    GalleriaModule,
    ImageModule
  ],
  providers: [MessageService, CookieService,
    { provide: HTTP_INTERCEPTORS, useClass: HeaderInterceptorService, multi: true },],
  bootstrap: [AppComponent]
})
export class AppModule { }

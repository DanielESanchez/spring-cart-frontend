import { Component } from '@angular/core';
import { MessageService } from 'primeng/api';
import { CategoryService } from 'src/app/services/categories/category.service';

interface Category {
  categoryId: string,
  name: string,
  description: string
}

@Component({
  selector: 'app-upload-category',
  templateUrl: './upload-category.component.html',
  styleUrls: ['./upload-category.component.scss'],
  providers: [MessageService]
})
export class UploadCategoryComponent {
  categoryToSave: Category = {
    categoryId: "",
    name: "",
    description: ""
  }

  constructor(private categoryService: CategoryService, private messageService: MessageService) {

  }

  saveCategory() {
    if (!this.categoryToSave) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: `Please fill all data to complete the process.`, closable: true })
      return
    }
    if (!this.checkCategoryDescription() || !this.checkCategoryId() || !this.checkCategoryName()) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: `Please fill all data to complete the process.`, closable: true })
      return
    }
    this.categoryToSave.categoryId = this.categoryToSave.categoryId.replace(/\s+/g, '');
    this.categoryService.saveNewCategory(this.categoryToSave).subscribe({
      next: (response: any) => {
        console.log(response.headers.get("Location"))
        this.messageService.add({ severity: 'success', summary: 'Category Saved', closable: true });
      },
      error: (error: any) => {
        this.messageService.add({ severity: 'error', summary: `Error ${error.status}`, detail: `There was saving the category.`, closable: true });
      }
    })
  }

  checkCategoryId() {
    return this.categoryToSave.categoryId.length > 1
  }

  checkCategoryName() {
    return this.categoryToSave.name.length > 1
  }

  checkCategoryDescription() {
    return this.categoryToSave.description.length > 1
  }
}

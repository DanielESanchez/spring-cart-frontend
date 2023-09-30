import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { lastValueFrom } from 'rxjs';
import { CategoryService } from 'src/app/services/categories/category.service';

interface Category {
  categoryId: string,
  name: string,
  description: string,
  isEnabled: boolean,
  status: string
}

@Component({
  selector: 'app-category-list-admin',
  templateUrl: './category-list-admin.component.html',
  styleUrls: ['./category-list-admin.component.scss'],
  providers: [MessageService]
})
export class CategoryListAdminComponent implements OnInit {
  categories!: Category[]
  private chooseDisable: boolean = false
  private chooseEnable: boolean = false
  private chooseDelete: boolean = false
  private categoryChosen: string = ""

  constructor(private messageService: MessageService,
    private categoryService: CategoryService,
    private router: Router) {

  }

  async ngOnInit(): Promise<void> {
    this.categories = await lastValueFrom(this.categoryService.getAllCategories())
    for (const key in this.categories) {
      this.categories[key].status = this.getStatus(this.categories[key].isEnabled)
    }
  }

  getStatus(status: boolean) {
    return status ? "Enabled" : "Disabled"
  }

  clear(table: Table) {
    table.clear();
  }

  onReject() {
    this.resetOptionChosen()
    this.messageService.clear()
  }

  resetOptionChosen() {
    this.chooseDelete = false
    this.chooseDisable = false
    this.chooseEnable = false
  }

  onConfirm() {
    if (this.chooseDelete) {
      this.deleteCategory()
      return
    }
    if (this.chooseDisable) {
      this.disableCategory()
      return
    }
    if (this.chooseEnable) {
      this.enableCategory()
      return
    }
    this.messageService.clear()
  }

  showConfirmEnable(categoryName: string, productId: string) {
    this.chooseEnable = true
    this.categoryChosen = productId
    this.messageService.add({ severity: 'warn', summary: 'Continue?', detail: `Are you sure you want to enable ${categoryName}?`, sticky: true, closable: false });
  }

  showConfirmDisable(categoryName: string, productId: string) {
    this.chooseDisable = true
    this.categoryChosen = productId
    this.messageService.add({ severity: 'warn', summary: 'Continue?', detail: `Are you sure you want to disable ${categoryName}?`, sticky: true, closable: false });

  }

  showConfirmDelete(categoryName: string, productId: string) {
    this.chooseDelete = true
    this.categoryChosen = productId
    this.messageService.add({ severity: 'warn', summary: 'Continue?', detail: `Are you sure you want to delete ${categoryName}?`, sticky: true, closable: false });
  }

  async deleteCategory() {
    this.messageService.clear()
    this.categoryService.deleteCategory(this.categoryChosen).subscribe({
      next: (res: any) => {
        this.messageService.add({ severity: 'success', summary: 'Category Deleted', detail: `The category with ID: ${this.categoryChosen} has been deleted`, sticky: true, closable: false });
        this.ngOnInit()
      },
      error: (err: any) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: `The category with ID: ${this.categoryChosen} could not be deleted. Please try again later`, sticky: true, closable: false });
      }
    })
    this.resetOptionChosen()
  }

  async enableCategory() {
    this.messageService.clear()
    this.categoryService.enableCategory(this.categoryChosen).subscribe({
      next: (res: any) => {
        this.messageService.add({ severity: 'success', summary: 'Category Enabled', detail: `The category with ID: ${this.categoryChosen} has been enabled`, sticky: true, closable: false });
        this.ngOnInit()
      },
      error: (err: any) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: `The category with ID: ${this.categoryChosen} could not be enabled. Please try again later`, sticky: true, closable: false });
      }
    })
    this.resetOptionChosen()
  }

  async disableCategory() {
    this.messageService.clear()
    this.categoryService.disableCategory(this.categoryChosen).subscribe({
      next: (res: any) => {
        this.messageService.add({ severity: 'success', summary: 'Category Disabled', detail: `The product with ID: ${this.categoryChosen} has been disabled`, sticky: true, closable: false });
        this.ngOnInit()
      },
      error: (err: any) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: `The product with ID: ${this.categoryChosen} could not be disabled. Please try again later`, sticky: true, closable: false });
      }
    })

    this.resetOptionChosen()
  }

  goEditCategory(categoryId: string) {
    this.router.navigate([`edit-category/${categoryId}`])
  }

}

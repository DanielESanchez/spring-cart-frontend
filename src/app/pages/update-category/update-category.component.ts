import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { lastValueFrom } from 'rxjs';
import { CategoryService } from 'src/app/services/categories/category.service';

interface Category {
  categoryId: string,
  name: string,
  description: string
}

@Component({
  selector: 'app-update-category',
  templateUrl: './update-category.component.html',
  styleUrls: ['./update-category.component.scss'],
  providers: [MessageService]
})
export class UpdateCategoryComponent implements OnInit {
  categoryId!: string
  category!: Category

  constructor(
    private messageService: MessageService,
    private categoryService: CategoryService,
    private activatedRoute: ActivatedRoute,
    private router: Router) {
    const idParam = this.activatedRoute.snapshot.paramMap.get('id')
    if (idParam) this.categoryId = idParam
  }

  async ngOnInit(): Promise<void> {
    this.category = await lastValueFrom(this.categoryService.getCategoryById(this.categoryId))
  }

  updateCategory(){
    if (!this.category) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: `Please fill all data to complete the process.`, closable: true })
      return
    }
    if (!this.checkCategoryDescription() || !this.checkCategoryName()) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: `Please fill all data to complete the process.`, closable: true })
      return
    }
    this.category.categoryId = this.categoryId;
    this.categoryService.updateCategory(this.category).subscribe({
      next: (response: any) => {
        this.messageService.add({ severity: 'success', summary: 'Category Updated', closable: true });
      },
      error: (error: any) => {
        this.messageService.add({ severity: 'error', summary: `Error ${error.status}`, detail: `There was saving the category.`, closable: true });
      }
    })
  }

  checkCategoryName() {
    return this.category.name.length > 1
  }

  checkCategoryDescription() {
    return this.category.description.length > 1
  }

  goToCategoryList(){
    this.router.navigate(["/admin-categories"])
  }


}

import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { lastValueFrom } from 'rxjs';
import { CategoryService } from 'src/app/services/categories/category.service';
import { ProductService } from 'src/app/services/products/product.service';
import { ReviewService } from 'src/app/services/reviews/review.service';
import { environment } from 'src/environments/environment.development';

interface Product {
  productId: string,
  name: string,
  description: string,
  categoriesId: string[],
  price: number,
  imagesId: string[],
  quantityAvailable: number,
  rating: number,
  categories: string,
  isEnable: boolean,
  image: string
}

@Component({
  selector: 'app-product-list-admin',
  templateUrl: './product-list-admin.component.html',
  styleUrls: ['./product-list-admin.component.scss'],
  providers: [MessageService]
})
export class ProductListAdminComponent implements OnInit {
  products: Product[] = []
  private chooseDisable: boolean = false
  private chooseEnable: boolean = false
  private chooseDelete: boolean = false
  private productChosen: string = ""

  constructor(private messageService: MessageService,
    private productsService: ProductService,
    private categoryService: CategoryService,
    private reviewService: ReviewService
  ) { }

  async ngOnInit(): Promise<void> {
    this.products = await lastValueFrom(this.productsService.getAllProductsAdmin())
    for (const key in this.products) {
      this.products[key].rating = await this.getRating(this.products[key].productId)
      this.products[key].categories = await this.getProductCategories(this.products[key].categoriesId)
      if (this.products[key].imagesId && this.products[key].imagesId.length > 0)
        this.products[key].image = `${environment.API_URL}download/image/${this.products[key].imagesId[0]}`
    }
  }

  getSeverity(quantityAvailable: number): string {
    if (quantityAvailable > 15) return 'success'
    if (quantityAvailable < 5) return 'danger'
    return 'warning'
  }

  getUrlImage(idImage: any): string {
    return `${environment.API_URL}download/${idImage}`
  }

  async getRating(productId: any): Promise<number> {
    const reviews = await lastValueFrom(this.reviewService.getAllReviewsForProductId(productId))
    let totalReviews = 0
    let ratingSum = 0
    for (const key in reviews) {
      totalReviews++
      ratingSum += Number(reviews[key].rating)
    }
    return ratingSum / totalReviews
  }

  async getProductCategories(categoriesId: string[]): Promise<string> {
    let categoriesString = ""
    let count = 0
    for (const key in categoriesId) {
      const category = await lastValueFrom(this.categoryService.getCategoryById(categoriesId[key]))
      if (count === 0) categoriesString += category.name
      else categoriesString += ", " + category.name
      count++
    }
    return categoriesString
  }

  getSeverityName(quantityAvailable: number) {
    if (quantityAvailable > 15) return 'IN STOCK'
    if (quantityAvailable < 1) return 'OUT OF STOCK'
    return 'LOW STOCK'
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
      this.deleteProduct()
      return
    }
    if (this.chooseDisable) {
      this.disableProduct()
      return
    }
    if (this.chooseEnable) {
      this.enableProduct()
      return
    }
    this.messageService.clear()
  }

  showConfirmEnable(productName: string, productId: string) {
    this.chooseEnable = true
    this.productChosen = productId
    this.messageService.add({ severity: 'warn', summary: 'Continue?', detail: `Are you sure you want to enable ${productName}?`, sticky: true, closable: false });
  }

  showConfirmDisable(productName: string, productId: string) {
    this.chooseDisable = true
    this.productChosen = productId
    this.messageService.add({ severity: 'warn', summary: 'Continue?', detail: `Are you sure you want to disable ${productName}?`, sticky: true, closable: false });

  }

  showConfirmDelete(productName: string, productId: string) {
    this.chooseDelete = true
    this.productChosen = productId
    this.messageService.add({ severity: 'warn', summary: 'Continue?', detail: `Are you sure you want to delete ${productName}?`, sticky: true, closable: false });
  }

  async deleteProduct() {
    this.messageService.clear()
    this.productsService.deleteProduct(this.productChosen).subscribe({
      next: (res: any) => {
        this.messageService.add({ severity: 'success', summary: 'Product Deleted', detail: `The product with ID: ${this.productChosen} has been deleted`, sticky: true, closable: false });
        this.ngOnInit()
      },
      error: (err: any) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: `The product with ID: ${this.productChosen} could not be deleted. Please try again later`, sticky: true, closable: false });
      }
    })
    this.resetOptionChosen()
  }

  async enableProduct() {
    this.messageService.clear()
    this.productsService.enableProduct(this.productChosen).subscribe({
      next: (res: any) => {
        this.messageService.add({ severity: 'success', summary: 'Product Enabled', detail: `The product with ID: ${this.productChosen} has been enabled`, sticky: true, closable: false });
        this.ngOnInit()
      },
      error: (err: any) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: `The product with ID: ${this.productChosen} could not be enabled. Please try again later`, sticky: true, closable: false });
      }
    })
    this.resetOptionChosen()
  }

  async disableProduct() {
    this.messageService.clear()
    this.productsService.disableProduct(this.productChosen).subscribe({
      next: (res: any) => {
        this.messageService.add({ severity: 'success', summary: 'Product Disabled', detail: `The product with ID: ${this.productChosen} has been disabled`, sticky: true, closable: false });
        this.ngOnInit()
      },
      error: (err: any) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: `The product with ID: ${this.productChosen} could not be disabled. Please try again later`, sticky: true, closable: false });
      }
    })

    this.resetOptionChosen()
  }

}

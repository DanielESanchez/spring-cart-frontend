import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SelectItem } from 'primeng/api';
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
  selector: 'app-search-product',
  templateUrl: './search-product.component.html',
  styleUrls: ['./search-product.component.scss']
})
export class SearchProductComponent implements OnInit {
  products: Product[] = []
  productsToFilter!: Product[]
  layout: "list" | "grid" = "list";
  categoryKey!: string;
  categoryOptions!: SelectItem[]
  searchParam!: string
  categoryParam!: string

  constructor(private productsService: ProductService,
    private categoryService: CategoryService,
    private reviewService: ReviewService,
    private router: Router,
    private activatedRoute: ActivatedRoute) { }

  async ngOnInit(): Promise<void> {
    this.activatedRoute.queryParams
      .subscribe(params => {
        const searchFromURL = params['q']
        if (!searchFromURL) this.router.navigate(['/'])
        this.searchParam = searchFromURL
        this.updateProducts()
      })
  }

  async updateProducts() {
    this.categoryOptions = [
      {
        label: "Show All Categories",
        value: "all"
      }
    ]
    this.products = await lastValueFrom(this.productsService.searchProduct(this.searchParam, this.categoryParam)).catch((err: HttpErrorResponse) => { })
    for (const key in this.products) {
      this.products[key].rating = await this.getRating(this.products[key].productId)
      this.products[key].categories = await this.getProductCategories(this.products[key].categoriesId)
      if (this.products[key].imagesId && this.products[key].imagesId.length > 0)
        this.products[key].image = `${environment.API_URL}download/image/${this.products[key].imagesId[0]}`
    }
    this.productsToFilter = this.products
    let categories = await lastValueFrom(this.categoryService.getAllCategories())
    for (const categoryKey in categories) {
      this.categoryOptions.push(
        {
          value: categories[categoryKey].categoryId,
          label: categories[categoryKey].name
        }
      )
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

  seeProduct(productId: string) {
    this.router.navigate([`/view-product/${productId}`])
  }

  onCategoryChange(event: any) {
    if (event.value === "all") this.categoryParam = ""
    else { this.categoryParam = event.value }
    this.updateProducts()
  }

}

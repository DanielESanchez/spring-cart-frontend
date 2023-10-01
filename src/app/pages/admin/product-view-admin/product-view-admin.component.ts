import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
  images: string[],
  totalRating: number
}

interface Review {
  rating: number,
  username: string,
  comment: string
}

@Component({
  selector: 'app-product-view-admin',
  templateUrl: './product-view-admin.component.html',
  styleUrls: ['./product-view-admin.component.scss']
})
export class ProductViewAdminComponent implements OnInit {
  product!: Product
  responsiveOptions: any[] | undefined;
  idFromRoute!: string
  value!: number;
  reviewsProduct!: Review[]
  totalReviews: number = 0

  constructor(private productService: ProductService,
    private categoryService: CategoryService,
    private reviewsService: ReviewService,
    private activatedRoute: ActivatedRoute,
    private router: Router) {
    const idParam = this.activatedRoute.snapshot.paramMap.get('id')
    if (idParam) this.idFromRoute = idParam
  }

  async ngOnInit() {
    this.responsiveOptions = [
      {
        breakpoint: '1024px',
        numVisible: 6
      },
      {
        breakpoint: '768px',
        numVisible: 3
      },
      {
        breakpoint: '560px',
        numVisible: 1
      }
    ];
    this.product = await lastValueFrom(this.productService.getProductByIdAdmin(this.idFromRoute)).catch((err: any) => { this.router.navigate(["/"]) })
    this.product.categories = await this.getProductCategories(this.product.categoriesId)
    this.product.images = []

    for (const key in this.product.imagesId) {
      this.product.images.push(`${environment.API_URL}download/image/${this.product.imagesId[key]}`)
    }
    this.reviewsProduct = await lastValueFrom(this.reviewsService.getAllReviewsForProductId(this.idFromRoute))
    this.product.rating = this.calculateRating(this.reviewsProduct)

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

  getUrlImage(idImage: any): string {
    return `${environment.API_URL}download/image/${idImage}`
  }

  calculateRating(reviews: Review[]): number {
    let totalReviews = 0
    let ratingSum = 0
    for (const key in reviews) {
      totalReviews++
      ratingSum += Number(reviews[key].rating)
    }
    this.totalReviews = totalReviews
    return ratingSum / totalReviews
  }
}

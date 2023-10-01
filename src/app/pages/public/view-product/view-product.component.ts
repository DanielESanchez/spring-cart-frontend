import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { lastValueFrom } from 'rxjs';
import { CookiesService } from 'src/app/services/auth-service/cookies.service';
import { LoginService } from 'src/app/services/auth-service/login.service';
import { CartService } from 'src/app/services/carts/cart.service';
import { CategoryService } from 'src/app/services/categories/category.service';
import { ProductService } from 'src/app/services/products/product.service';
import { ReviewService } from 'src/app/services/reviews/review.service';
import { SignalCartService } from 'src/app/services/signals/signal-cart.service';
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

interface ShoppingCart {
  username: string
}

interface ProductShoppingCart {
  productId: string,
  quantity: number
}

interface Review {
  rating: number,
  username: string,
  comment: string,
  productId: string
}
@Component({
  selector: 'app-view-product',
  templateUrl: './view-product.component.html',
  styleUrls: ['./view-product.component.scss'],
  providers: [MessageService]
})
export class ViewProductComponent implements OnInit {
  product!: Product
  responsiveOptions: any[] | undefined;
  productIdFromRoute!: string
  value!: number;
  reviewsProduct!: Review[]
  totalReviews: number = 0
  quantitySelected: number = 1
  isSaveReview: boolean = false
  comment!: string
  private isSavedReview: boolean = false

  constructor(private productService: ProductService,
    private categoryService: CategoryService,
    private reviewsService: ReviewService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private cookiesService: CookiesService,
    private cartService: CartService,
    private messageService: MessageService,
    public loginService: LoginService,
    private signalCartService: SignalCartService) {
    const idParam = this.activatedRoute.snapshot.paramMap.get('id')
    if (idParam) this.productIdFromRoute = idParam
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
    this.product = await lastValueFrom(this.productService.getProductById(this.productIdFromRoute)).catch((err: any) => { this.router.navigate(["/"]) })
    this.product.categories = await this.getProductCategories(this.product.categoriesId)
    this.product.images = []

    for (const key in this.product.imagesId) {
      this.product.images.push(`${environment.API_URL}download/image/${this.product.imagesId[key]}`)
    }
    this.reviewsProduct = await lastValueFrom(this.reviewsService.getAllReviewsForProductId(this.productIdFromRoute))
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

  async addToCart() {
    const username = this.cookiesService.getUsernameCookie()
    if (!username) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: `Please login before to add a product to your cart.`, closable: true });
      return;
    }
    const shoppincartNew: ShoppingCart = {
      username: username
    }
    const shoppingCartSaved = await lastValueFrom(this.cartService.getCart(username)).catch(async () => {
      await lastValueFrom(this.cartService.saveNewCart(shoppincartNew))
    })
    const productToAdd: ProductShoppingCart = {
      productId: this.productIdFromRoute,
      quantity: this.quantitySelected
    }
    await lastValueFrom(this.cartService.addToCart(productToAdd, username)).catch(() => {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: `There was an error adding ${this.product.name} to your cart.`, closable: true });
    })
    this.messageService.add({ severity: 'success', summary: 'Item Added', detail: `The item ${this.product.name}, was added to your cart.`, closable: true })
    this.calculateProductsInCart()
  }

  saveReview() {
    this.isSaveReview = true
    this.messageService.add({ severity: 'info', summary: 'Continue?', detail: `Do yo want to save a review for this product?.`, closable: false })
  }

  async onConfirmSaveReview() {
    this.messageService.clear()
    this.isSaveReview = false
    const username = this.cookiesService.getUsernameCookie()
    const reviewToSave: Review = {
      rating: this.product.rating,
      username: username,
      comment: this.comment,
      productId: this.productIdFromRoute
    }
    const response = await lastValueFrom(this.reviewsService.saveNewReview(reviewToSave)).catch(() => {
      this.isSaveReview = false
      this.messageService.add({ severity: 'error', summary: 'Error', detail: `There was an error saving your review, if you already saved one for this product, you cannot add another one.`, closable: true });
    })
    if (response)
      {this.messageService.add({ severity: 'success', summary: 'Item Added', detail: `The was saved successfully.`, closable: true })}
  }

  onClose(){
    this.messageService.clear()
  }

  onRejectSaveReview() {
    this.isSaveReview = false
    this.messageService.clear()
  }

  onCloseSaveReview() {
    this.isSaveReview = false
    this.messageService.clear()
  }

  async calculateProductsInCart(){
    const username = this.cookiesService.getUsernameCookie()
    const cartSaved = await lastValueFrom(this.cartService.getCart(username))
    let totalProductsInCart = 0;
    for (const key in cartSaved.products) {
      totalProductsInCart += totalProductsInCart + cartSaved.products[key].quantity
    }
    this.signalCartService.emitSignal(totalProductsInCart)
  }


}

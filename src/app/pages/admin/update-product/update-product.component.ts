import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';
import { FileRemoveEvent, FileSelectEvent } from 'primeng/fileupload';
import { lastValueFrom } from 'rxjs';
import { CategoryService } from 'src/app/services/categories/category.service';
import { ImageService } from 'src/app/services/files/image.service';
import { ProductService } from 'src/app/services/products/product.service';

interface Category {
  categoryId: string,
  name: string
}

interface Product {
  productId: string,
  name: string,
  description: string,
  categoriesId: string[],
  price: number,
  imagesId: string[],
  quantityAvailable: number
}

@Component({
  selector: 'app-update-product',
  templateUrl: './update-product.component.html',
  styleUrls: ['./update-product.component.scss']
})
export class UpdateProductComponent {
  product: Product = {
    productId: "",
    name: "",
    description: "",
    categoriesId: [],
    price: 0,
    imagesId: [],
    quantityAvailable: 0
  }
  images: File[] = []
  responseImage: any
  isErrorForm: boolean = false
  categoriesFromBD!: Category[]
  selectedCategories!: Category[]
  private savedProduct: boolean = false
  productIdFromURL!: string

  constructor(private messageService: MessageService,
    private imageService: ImageService,
    private productService: ProductService,
    private categoryService: CategoryService,
    private activatedRoute: ActivatedRoute) {
    const idParam = this.activatedRoute.snapshot.paramMap.get('id')
    if (idParam) this.productIdFromURL = idParam

  }
  async ngOnInit(): Promise<void> {
    this.savedProduct = false
    this.categoriesFromBD = []
    this.product = await lastValueFrom(this.productService.getProductByIdAdmin(this.productIdFromURL))
    let categories = await lastValueFrom(this.categoryService.getAllCategories())
    for (const categoryKey in categories) {
      this.categoriesFromBD.push(
        {
          categoryId: categories[categoryKey].categoryId,
          name: categories[categoryKey].name
        }
      )
    }
  }

  async saveProduct() {
    this.isErrorForm = false
    this.messageService.add({ severity: 'warn', summary: 'Continue?', detail: `Are you sure you want to save ${this.product.name}?`, sticky: true, closable: true });
  }

  async saveConfirmed() {
    if (this.savedProduct) return
    if (!this.checkProduct()) {
      this.isErrorForm = true
      this.messageService.add({ severity: 'error', summary: 'Error', detail: `Please add all fields to save the new item.`, closable: true });
      return
    }
    if(this.images.length > 0){
      this.product.imagesId = []
      for (const imageKey in this.images) {
        this.responseImage = await lastValueFrom(this.imageService.saveImage(this.images[imageKey])).catch(() => {
          this.isErrorForm = true
          this.messageService.add({ severity: 'error', summary: 'Error', detail: `There was an error saving ${this.product.name}, please try again later.`, closable: true });
        })
        this.product.imagesId.push(this.responseImage.headers.get("Location"))
      }
    }
    if(this.selectedCategories && this.selectedCategories.length > 0 ){
      this.product.categoriesId = []
      for (const categoryKey in this.selectedCategories) {
        this.product.categoriesId.push(this.selectedCategories[categoryKey].categoryId)
      }
    }
    this.product.productId = this.product.productId.replace(/\s+/g, '-');
    const responseMenu = await lastValueFrom(this.productService.updateProduct(this.product)).catch(() => {
      this.isErrorForm = true
      this.messageService.add({ severity: 'error', summary: 'Error', detail: `There was an error saving ${this.product.name}, please try again later.`, closable: true });
      this.deleteProduct()
      for (const key in this.product.imagesId) {
        this.deleteImage(this.product.imagesId[key])
      }
    })
    if (!responseMenu) return
    this.savedProduct = true
    this.messageService.add({ severity: 'success', summary: 'Item Saved', detail: `The item ${this.product.name}, was added.`, closable: true })
  }

  checkProduct(): boolean {
    if (this.product.productId.length < 1) return false
    if (this.product.name.length < 1) return false
    if (this.product.description.length < 1) return false
    if (this.product.price < 1) return false
    if (this.product.quantityAvailable < 1) return false
    return true
  }

  deleteProduct() {
    this.productService.deleteProduct(this.product.productId)
  }

  deleteImage(imageId: string) {
    this.imageService.deleteImage(imageId)
  }

  onConfirm() {
    this.closeMessages()
    this.saveConfirmed()
  }

  onReject() {
    this.closeMessages()
  }

  closeMessages() {
    this.messageService.clear()
  }

  onSelect(event: FileSelectEvent) {
    for (let file of event.files) {
      this.images.push(file);
    }
  }

  onRemove(event: FileRemoveEvent) {
    this.images.forEach((item, index) => {
      if (item === event.file) this.images.splice(index, 1)
    })
  }

  onClear() {
    console.log("called on clear")
    this.images = []
  }

}

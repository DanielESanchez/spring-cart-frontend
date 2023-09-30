import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { FileSelectEvent, FileUploadEvent } from 'primeng/fileupload';
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

interface RemoveEvent {
  originalEvent: Event;
  file: File;
}

@Component({
  selector: 'app-upload-product',
  templateUrl: './upload-product.component.html',
  styleUrls: ['./upload-product.component.scss'],
  providers: [MessageService]
})
export class UploadProductComponent implements OnInit {
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

  constructor(private messageService: MessageService,
    private imageService: ImageService,
    private productService: ProductService,
    private categoryService: CategoryService) {
  }
  async ngOnInit(): Promise<void> {
    this.savedProduct = false
    this.categoriesFromBD = []
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
    this.messageService.add({ severity: 'warn', summary: 'Continue?', detail: `Are you sure you want to save ${this.product.name}?`, sticky: true, closable: false });
  }

  async saveConfirmed() {
    if (this.savedProduct) return
    if (!this.images) {
      this.isErrorForm = true
      this.messageService.add({ severity: 'error', summary: 'Error', detail: `Please add an image.`, closable: false });
      return
    }
    if (!this.checkProduct()) {
      this.isErrorForm = true
      this.messageService.add({ severity: 'error', summary: 'Error', detail: `Please add all fields to save the new item.`, closable: false });
      return
    }
    for (const imageKey in this.images) {
      this.responseImage = await lastValueFrom(this.imageService.saveImage(this.images[imageKey])).catch(() => {
        this.isErrorForm = true
        this.messageService.add({ severity: 'error', summary: 'Error', detail: `There was an error saving ${this.product.name}, please try again later.`,  closable: false });
      })
      this.product.imagesId.push(this.responseImage.headers.get("Location"))
    }
    for (const categoryKey in this.selectedCategories) {
      this.product.categoriesId.push(this.selectedCategories[categoryKey].categoryId)
    }
    if (this.product.categoriesId.length < 1) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: `Please select at least 1 category to save new item.`,  closable: false });
      return
    }
    const responseMenu = await lastValueFrom(this.productService.saveNewProduct(this.product)).catch(() => {
      this.isErrorForm = true
      this.messageService.add({ severity: 'error', summary: 'Error', detail: `There was an error saving ${this.product.name}, please try again later.`, closable: false });
      //this.deleteMenu()
    })
    if (!responseMenu) return
    this.messageService.add({ severity: 'success', summary: 'Item Saved', detail: `The item ${this.product.name}, was added to the menu.`, closable: false })
    this.savedProduct = true
  }

  checkProduct(): boolean {
    if (this.product.productId.length < 1) return false
    if (this.product.name.length < 1) return false
    if (this.images.length < 1) return false
    if (this.product.description.length < 1) return false
    if (this.product.price < 1) return false
    if (this.product.quantityAvailable < 1) return false
    return true
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

  onRemove(event: RemoveEvent) {
    this.images.forEach((item, index) => {
      if (item === event.file) this.images.splice(index, 1)
    })
  }

  onClear() {
    console.log("called on clear")
    this.images = []
  }


}

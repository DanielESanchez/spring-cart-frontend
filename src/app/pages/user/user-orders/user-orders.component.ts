import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Table } from 'primeng/table';
import { lastValueFrom } from 'rxjs';
import { CookiesService } from 'src/app/services/auth-service/cookies.service';
import { OrderService } from 'src/app/services/orders/order.service';
import { ProductService } from 'src/app/services/products/product.service';
interface Order {
  total: number,
  shoppingCart: any,
  orderDate: string,
  isCompleted: boolean,
  isRefunded: boolean,
  isCanceled: boolean,
  status: string,
  date: number,
  isPaid: boolean
}

@Component({
  selector: 'app-user-orders',
  templateUrl: './user-orders.component.html',
  styleUrls: ['./user-orders.component.scss']
})
export class UserOrdersComponent implements OnInit {
  orders!: Order[]

  constructor(private orderService: OrderService,
    private cookiesService: CookiesService,
    private router: Router,
    private productService: ProductService) {

  }

  async ngOnInit(): Promise<void> {
    const username = this.cookiesService.getUsernameCookie()
    if (!username) this.router.navigate(["/"])
    this.orders = await lastValueFrom(this.orderService.getOrdersUser(username))
    for (const keyOrder in this.orders) {
      const actualOrder = this.orders[keyOrder]
      actualOrder.status = this.getStatus(actualOrder.isCanceled, actualOrder.isRefunded, actualOrder.isCompleted, actualOrder.isPaid)
      actualOrder.orderDate = new Date(actualOrder.orderDate).toLocaleDateString()
      actualOrder.date = new Date(actualOrder.orderDate).getTime()
      for (const keyProduct in actualOrder.shoppingCart.products) {
        const products = actualOrder.shoppingCart.products
        const productFound = await lastValueFrom(this.productService.getProductById(products[keyProduct].productId))
        products[keyProduct].name = productFound.name
        if (!products[keyProduct].name) products[keyProduct].name = products[keyProduct].productId
      }
    }
    this.orders = this.orders.sort((a, b) => b.date - a.date);
  }

  clear(table: Table) {
    table.clear()
  }

  getSeverityName(quantityAvailable: number) {
    if (quantityAvailable > 15) return 'IN STOCK'
    if (quantityAvailable < 1) return 'OUT OF STOCK'
    return 'LOW STOCK'
  }

  getStatus(isCanceled: boolean, isRefunded: boolean, isCompleted: boolean, isPaid: boolean) {
    if (isRefunded) return 'REFUNDED'
    if (isCanceled) return 'CANCELED'
    if (isCompleted) return 'COMPLETED'
    if (!isPaid) return 'NOT PAID'
    return 'IN PROGRESS'
  }

  getSeverity(status: string): string {
    switch (status) {
      case "REFUNDED": return 'help'
      case "CANCELED": return 'danger'
      case "COMPLETED": return 'success'
      case "IN PROGRESS": return 'warning'
      case "NOT PAID": return 'danger'
      default: return 'warning'
    }
  }

}

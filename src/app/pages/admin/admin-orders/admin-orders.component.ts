import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { lastValueFrom } from 'rxjs';
import { CookiesService } from 'src/app/services/auth-service/cookies.service';
import { OrderService } from 'src/app/services/orders/order.service';
import { ProductService } from 'src/app/services/products/product.service';

interface Order {
  total: number,
  shoppingCart: any,
  username: string,
  orderDate: string,
  isCompleted: boolean,
  isRefunded: boolean,
  isCanceled: boolean,
  isPaid: boolean,
  status: string,
  date: number
}

@Component({
  selector: 'app-admin-orders',
  templateUrl: './admin-orders.component.html',
  styleUrls: ['./admin-orders.component.scss'],
  providers: [MessageService]
})
export class AdminOrdersComponent implements OnInit {
  orders!: Order[]
  isCancelProcess!: boolean
  isRefundProcess!: boolean
  isCompleteProcess!: boolean
  private usernameChosen!: string
  private orderChosen!: string

  constructor(private orderService: OrderService,
    private cookiesService: CookiesService,
    private router: Router,
    private productService: ProductService,
    private messageService: MessageService) {

  }

  async ngOnInit(): Promise<void> {
    const username = this.cookiesService.getUsernameCookie()
    if (!username) this.router.navigate(["/"])
    await this.updateOrders()
  }

  async updateOrders() {
    this.orders = await lastValueFrom(this.orderService.getAllOrdersAdmin())
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

  showConfirmCancel(username: string, _id: string) {
    this.isCancelProcess = true
    this.messageService.add({ severity: 'warn', summary: 'Continue?', detail: `Are you sure you want to cancel this order for user ${username}?`, sticky: true, closable: false });
    this.orderChosen = _id
    this.usernameChosen = username
  }

  async onConfirmCancel() {
    this.messageService.clear()
    let isError = false
    await lastValueFrom(this.orderService.cancelOrder(this.orderChosen)).catch((httpError: HttpErrorResponse) => {
      this.isCancelProcess = false
      this.messageService.add({ severity: 'error', summary: `Error ${httpError.status}`, detail: `The order could not be marked as canceled`, sticky: true, closable: true });
      isError = true
    })
    this.isCancelProcess = false
    this.messageService.add({ severity: 'success', summary: `Canceled`, detail: `The order for user ${this.usernameChosen} was canceled`, sticky: true, closable: true });
    this.updateOrders()
  }

  onRejectCancel() {
    this.messageService.clear()
    this.isCancelProcess = false
  }

  showConfirmRefund(username: string, _id: string) {
    this.isRefundProcess = true
    this.messageService.add({ severity: 'warn', summary: 'Continue?', detail: `Are you sure you want to refund this order for user ${username}?`, sticky: true, closable: false });
    this.orderChosen = _id
    this.usernameChosen = username
  }

  async onConfirmRefund() {
    this.messageService.clear()
    let isError = false
    await lastValueFrom(this.orderService.refundOrder(this.orderChosen)).catch((httpError: HttpErrorResponse) => {
      this.isRefundProcess = false
      isError = true
      this.messageService.add({ severity: 'error', summary: `Error ${httpError.status}`, detail: `The order could not be marked as refunded`, sticky: true, closable: true });
    })
    if (isError) return
    this.isRefundProcess = false
    this.messageService.add({ severity: 'success', summary: `Refunded`, detail: `The order for user ${this.usernameChosen} was refunded`, sticky: true, closable: true });
    this.updateOrders()
  }

  onRejectRefund() {
    this.messageService.clear()
    this.isRefundProcess = false
  }

  showConfirmComplete(username: string, _id: string) {
    this.isCompleteProcess = true
    this.messageService.add({ severity: 'warn', summary: 'Continue?', detail: `Are you sure you want to complete this order for user ${username}?`, sticky: true, closable: false });
    this.orderChosen = _id
    this.usernameChosen = username
  }

  async onConfirmComplete() {
    this.messageService.clear()
    let isError = false
    await lastValueFrom(this.orderService.completeOrder(this.orderChosen)).catch((httpError: HttpErrorResponse) => {
      this.isCompleteProcess = false
      this.messageService.add({ severity: 'error', summary: `Error ${httpError.status}`, detail: `The order could not be marked as complete`, sticky: true, closable: true });
      isError = true
    })
    if (isError) return
    this.messageService.add({ severity: 'success', summary: `Completed`, detail: `The order for user ${this.usernameChosen} was marked as completed`, sticky: true, closable: true });
    this.updateOrders()
  }

  onRejectComplete() {
    this.messageService.clear()
    this.isCompleteProcess = false
  }

}

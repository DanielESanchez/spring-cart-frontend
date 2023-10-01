import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, Signal } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem, MessageService } from 'primeng/api';
import { Subscription, lastValueFrom } from 'rxjs';
import { CookiesService } from 'src/app/services/auth-service/cookies.service';
import { LogoutService } from 'src/app/services/auth-service/logout.service';
import { CartService } from 'src/app/services/carts/cart.service';
import { OrderService } from 'src/app/services/orders/order.service';
import { ProductService } from 'src/app/services/products/product.service';
import { SignalCartService } from 'src/app/services/signals/signal-cart.service';

interface ProductShoppingCart {
  name: string,
  quantity: number,
  price: number
}

interface Order {
  shoppingCart: any,
  total: number,
  taxes: number
}

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  providers: [MessageService]
})
export class NavbarComponent implements OnInit {
  data?: Signal<any>;
  private signalSubscription?: Subscription;
  items: MenuItem[] | undefined;
  isShoppingCart!: boolean
  isSavingOrderProcess!: boolean
  isBuyingOrderProcess!: boolean
  totalShoppingCart: number = 0
  productsInCart!: ProductShoppingCart[]
  private orderId!: string | null
  orderSaved!: Order

  constructor(private signalService: SignalCartService,
    private messageService: MessageService,
    private logoutService: LogoutService,
    private router: Router,
    private cookiesService: CookiesService,
    private cartService: CartService,
    private signalCartService: SignalCartService,
    private productService: ProductService,
    private orderService: OrderService) {

  }

  async ngOnInit() {
    this.signalSubscription = this.signalService.getSignal().subscribe((data: any) => {
      this.data = data;
      this.updateItems()
    });
    this.updateItems();
    const username = this.cookiesService.getUsernameCookie()
    if (username) {
      const cartSaved = await lastValueFrom(this.cartService.getCart(username)).catch((err: any) => { })
      if (!cartSaved) return
      let totalProductsInCart = 0;
      for (const key in cartSaved.products) {
        totalProductsInCart += cartSaved.products[key].quantity
      }
      this.signalCartService.emitSignal(totalProductsInCart)
    }
  }


  ngOnDestroy() {
    if (this.signalSubscription)
      this.signalSubscription.unsubscribe();
  }

  updateItems() {
    this.items = [
      {
        label: 'Home',
        icon: 'pi pi-fw pi-home',
        routerLink: '/',
      },
      {
        label: 'Cart',
        icon: 'pi pi-fw pi-shopping-cart',
        badge: this.data?.toString(),
        badgeStyleClass: "badge-cart",
        command: () => {
          this.onShowCart()
        }
      },
      {
        label: 'New Product',
        icon: 'pi pi-fw pi-plus',
        routerLink: '/new-product'
      },
      {
        label: 'Users',
        icon: 'pi pi-fw pi-users',
        routerLink: '/users'
      },
      {
        label: 'Employees',
        icon: 'pi pi-fw pi-user',
        items: [
          {
            label: 'Add Employee',
            icon: 'pi pi-fw pi-user-plus',
            routerLink: "/save-employee"
          },
          {
            label: "Employee's List",
            icon: 'pi pi-fw pi-users',
            routerLink: "/list-employee"

          }
        ]
      },
      {
        label: 'Login',
        icon: 'pi pi-fw pi-sign-in',
        routerLink: "/login"
      },
      {
        label: 'Logout',
        icon: 'pi pi-fw pi-sign-out',
        command: () => {
          this.logoutService.logout()
          this.messageService.add({ severity: 'success', summary: 'Logged Out', detail: "", life: 3000 });
        }
      }
    ];
  }

  goHome() {
    window.location.href = "/"
  }

  async onShowCart() {
    this.isShoppingCart = true
    const username = this.cookiesService.getUsernameCookie()
    if (!username) {
      this.isShoppingCart = false
      return
    }
    this.productsInCart = []
    const cartSaved = await lastValueFrom(this.cartService.getCart(username))
    if (!cartSaved) return
    this.totalShoppingCart = cartSaved.total
    let totalProductsInCart = 0;
    for (const key in cartSaved.products) {
      const product = await lastValueFrom(this.productService.getProductById(cartSaved.products[key].productId))
      totalProductsInCart += totalProductsInCart + cartSaved.products[key].quantity
      const productCart: ProductShoppingCart = {
        name: product.name,
        quantity: cartSaved.products[key].quantity,
        price: cartSaved.products[key].quantity * product.price
      }
      this.productsInCart.push(productCart)
    }
    this.messageService.add({ severity: 'success', summary: '', detail: "", closable: false });
  }

  async onConfirmCart() {
    this.messageService.clear()
    this.isShoppingCart = false
    const username = this.cookiesService.getUsernameCookie()
    if (!username) {
      this.isSavingOrderProcess = false
      return
    }
    const response = await lastValueFrom(this.orderService.saveNewOrder(username))
    if (!response) return
    this.isSavingOrderProcess = true
    this.orderId = response.headers.get("Location")
    this.orderSaved = await lastValueFrom(this.orderService.getOrder(this.orderId)).catch(() => {
      this.isSavingOrderProcess = false
      this.messageService.add({ severity: 'error', summary: 'Error', detail: "We could not load your order.", life: 3000 });
    })
    await lastValueFrom(this.cartService.deleteCart(username))
    this.isSavingOrderProcess = false
    this.isBuyingOrderProcess = true
    this.messageService.add({ severity: 'success', summary: '', detail: "", closable: false });
  }

  onRejectCart() {
    this.messageService.clear()
    this.isShoppingCart = false
  }

  async onConfirmBuy() {
    this.messageService.clear()
    const username = this.cookiesService.getUsernameCookie()
    if (!username) return
    await lastValueFrom(this.orderService.buyOrder(this.orderId)).catch(() => {
      this.isSavingOrderProcess = false
      this.messageService.add({ severity: 'error', summary: 'Error', detail: "We could not process your order.", life: 3000 });
    })
    this.isBuyingOrderProcess = false
    this.messageService.add({ severity: 'success', summary: 'Completed', detail: "Order process completed. Thank for buying our products.", closable: true });
    this.data = undefined
    this.updateItems()
  }

  async onRejectBuy() {
    this.messageService.clear()
    this.isBuyingOrderProcess = false
    const username = this.cookiesService.getUsernameCookie()
    if (!username) return
    await lastValueFrom(this.orderService.cancelOrder(this.orderId)).catch(() => {
      this.isBuyingOrderProcess = false
    })
    this.data = undefined
    this.updateItems()
  }


}

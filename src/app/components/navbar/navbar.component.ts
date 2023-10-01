import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, Signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuItem, MessageService } from 'primeng/api';
import { Subject, Subscription, debounceTime, lastValueFrom } from 'rxjs';
import { CheckRoleService } from 'src/app/services/auth-services/check-role.service';
import { CookiesService } from 'src/app/services/auth-services/cookies.service';
import { LoginService } from 'src/app/services/auth-services/login.service';
import { LogoutService } from 'src/app/services/auth-services/logout.service';
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
  private debouncerSearch: Subject<string> = new Subject<string>()
  private debouncerLogout: Subject<any> = new Subject<any>()
  private signalSubscription?: Subscription;
  private orderId!: string | null
  signalProductsInCart?: Signal<any>;
  items: MenuItem[] | undefined;
  isShoppingCart!: boolean
  isSavingOrderProcess!: boolean
  isBuyingOrderProcess!: boolean
  totalShoppingCart: number = 0
  productsInCart!: ProductShoppingCart[]
  orderSaved!: Order
  searchParam!: string


  constructor(private signalService: SignalCartService,
    private messageService: MessageService,
    private logoutService: LogoutService,
    private loginService: LoginService,
    private cookiesService: CookiesService,
    private cartService: CartService,
    private signalCartService: SignalCartService,
    private productService: ProductService,
    private orderService: OrderService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private checkRoleService: CheckRoleService) {

  }

  async ngOnInit() {
    this.signalSubscription = this.signalService.getSignal().subscribe((data: any) => {
      this.signalProductsInCart = data;
      this.updateItems()
    })
    this.debouncerSearch.pipe(debounceTime(1000)).subscribe(value => {
      this.router.navigate(["/search"], { queryParams: { q: value } })
    })
    this.activatedRoute.queryParams
      .subscribe(params => {
        const searchFromURL = params['q']
        if (!searchFromURL) this.searchParam = ""
        else { this.searchParam = searchFromURL }
      })
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
      this.signalSubscription.unsubscribe()
    if (this.debouncerSearch)
      this.debouncerSearch.unsubscribe()
    if (this.debouncerLogout)
      this.debouncerLogout.unsubscribe()
  }

  startDebouncerLogout() {
    this.debouncerLogout.pipe(debounceTime(2000)).subscribe(value => {
      this.updateItems()
      window.location.href = "/"
    })
  }

  updateItems() {
    this.items = [
      {
        label: 'Home',
        icon: 'pi pi-fw pi-home',
        routerLink: '/',
      },
      {
        label: 'Users',
        icon: 'pi pi-fw pi-users',
        routerLink: '/admin-users',
        visible: this.checkRoleService.hasRole("ADMIN")
      },
      {
        label: 'Categories',
        icon: 'pi pi-fw pi-tags',
        visible: this.checkRoleService.hasRole("ADMIN"),
        items: [
          {
            label: 'Add Category',
            icon: 'pi pi-fw pi-plus',
            routerLink: "/new-product"
          },
          {
            label: "Categorie's List",
            icon: 'pi pi-fw pi-server',
            routerLink: "/admin-products",
          }
        ]
      },
      {
        label: 'Products',
        icon: 'pi pi-fw pi-shopping-bag',
        visible: this.checkRoleService.hasRole("ADMIN"),
        items: [
          {
            label: 'Add Product',
            icon: 'pi pi-fw pi-plus',
            routerLink: "/new-product"
          },
          {
            label: "Product's List",
            icon: 'pi pi-fw pi-server',
            routerLink: "/admin-products"

          }
        ]
      },
      {
        label: 'Orders',
        icon: 'pi pi-fw pi-history',
        routerLink: "/admin-orders",
        visible: this.checkRoleService.hasRole("ADMIN")
      },
      {
        label: 'My Orders',
        icon: 'pi pi-fw pi-history',
        routerLink: "/user-orders",
        visible: !this.checkRoleService.hasRole("ADMIN") && this.loginService.isLoggedIn(),
      },
      {
        label: 'Login',
        icon: 'pi pi-fw pi-sign-in',
        routerLink: "/login",
        visible: !this.loginService.isLoggedIn()
      },
      {
        label: 'Logout',
        icon: 'pi pi-fw pi-sign-out',
        visible: this.loginService.isLoggedIn(),
        command: () => {
          this.logoutService.logout()
          this.messageService.add({ severity: 'success', summary: 'Logged Out', detail: "", life: 3000 });
          this.signalProductsInCart = undefined
          this.startDebouncerLogout()
          this.debouncerLogout.next("")
        }
      },
      {
        label: 'Cart',
        icon: 'pi pi-fw pi-shopping-cart',
        badge: this.signalProductsInCart?.toString(),
        badgeStyleClass: "badge-cart",
        visible: !this.checkRoleService.hasRole("ADMIN")  && this.loginService.isLoggedIn(),
        command: () => {
          this.onShowCart()
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
    this.signalProductsInCart = undefined
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
    this.signalProductsInCart = undefined
    this.updateItems()
    this.messageService.add({ severity: 'warn', summary: 'Canceled', detail: "Order canceled. You must add products to cart again if you want to shopping.", closable: true });
  }

  searchValue(searchValue: string) {
    if (searchValue.length < 3) return
    this.debouncerSearch.next(searchValue)
  }

  searchEnter(searchValue: string) {
    if (searchValue.length < 3) this.router.navigate(["/"])
    this.router.navigate(["/search"], { queryParams: { q: searchValue } })
  }

}

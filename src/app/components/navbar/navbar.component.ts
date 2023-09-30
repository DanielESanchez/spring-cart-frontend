import { Component, OnInit, Signal } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem, MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { LogoutService } from 'src/app/services/auth-service/logout.service';
import { SignalCartService } from 'src/app/services/signals/signal-cart.service';

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

  constructor(private signalService: SignalCartService,
    private messageService: MessageService,
    private logoutService: LogoutService,
    private router: Router) {

  }

  ngOnInit() {
    const path = location.pathname
    this.signalSubscription = this.signalService.getSignal().subscribe((data: any) => {
      this.data = data;
      this.updateItems()
    });
    this.updateItems();
  }


  ngOnDestroy() {
    if (this.signalSubscription)
      this.signalSubscription.unsubscribe();
  }

  updateItems(){
    this.items = [
      {
        label: 'Home',
        icon: 'pi pi-fw pi-home',
        routerLink: '/',
      },
      {
        label: 'Cart',
        icon: 'pi pi-fw pi-shopping-cart',
        routerLink: '/check-order',
        badge: this.data?.toString(),
        badgeStyleClass: "badge-cart",
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
          this.messageService.add({ severity: 'success', summary: 'Logged Out', detail: "" });
          this.logoutService.logout()
          this.router.navigate(["/"])
          //this.signalService.emitSignal(5)
        }
      }
    ];
  }

}

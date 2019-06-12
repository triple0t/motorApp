import { Component, OnInit, HostListener, ViewChild, Directive } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { Settings, AppSettings } from '../app.settings';
import { AppService } from '../app.service';
import { Category, Product } from '../app.models';
import { SidenavMenuService } from '../theme/components/sidenav-menu/sidenav-menu.service';
import { MenuComponent } from '../theme/components/menu/menu.component'

@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.scss'],
  providers: [SidenavMenuService],

})
export class PagesComponent implements OnInit {
  opennav: boolean = false;
  openVehicleNav: boolean = false;
  public showBackToTop: boolean = false;
  public categories: Category[];
  public category: Category;
  public sidenavMenuItems: Array<any>;
  @ViewChild('sidenav') sidenav: any;
  @ViewChild(MenuComponent) private menu: MenuComponent;
  seconds() { return 0; }
  public settings: Settings;
  scrolled: boolean;
  constructor(public appSettings: AppSettings,
    public appService: AppService,
    public sidenavMenuService: SidenavMenuService,
    public router: Router) {
    this.settings = this.appSettings.settings;
  }

  ngOnInit() {    
    this.appService.getCart()
    this.getCategories();
    this.sidenavMenuItems = this.sidenavMenuService.getSidenavMenuItems();
  }

  public getCategories() {
    this.appService.getCategories().subscribe(data => {
      this.categories = data;
      this.category = data[0];
      this.appService.Data.categories = data;
    })
  }

  public changeCategory(event) {
    if (event.target) {
      this.category = this.categories.filter(category => category.name == event.target.innerText)[0];
    }
    if (window.innerWidth < 960) {
      this.stopClickPropagate(event);
    }
  }

  public remove(product) {
    const index: number = this.appService.Data.cartList.indexOf(product);
    if (index !== -1) {
      this.appService.Data.cartList.splice(index, 1);
      this.appService.Data.totalPrice = this.appService.Data.totalPrice - product.newPrice * product.cartCount;
      this.appService.Data.totalCartCount = this.appService.Data.totalCartCount - product.cartCount;
      this.appService.resetProductCartCount(product);
    }
  }

  public clear() {
    this.appService.Data.cartList.forEach(product => {
      this.appService.resetProductCartCount(product);
    });
    this.appService.Data.cartList.length = 0;
    this.appService.Data.totalPrice = 0;
    this.appService.Data.totalCartCount = 0;
  }


  public changeTheme(theme) {
    this.settings.theme = theme;
  }

  public stopClickPropagate(event: any) {
    event.stopPropagation();
    event.preventDefault();
  }

  public search() { }


  public scrollToTop() {
  }

  @HostListener('window:scroll', ['$event'])
  onWindowScroll($event) {
    ($event.target.documentElement.scrollTop > 20) ? this.scrolled = true : this.scrolled = false;
  }


  ngAfterViewInit() {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.sidenav.close();
      }
    });
    this.sidenavMenuService.expandActiveSubMenu(this.sidenavMenuService.getSidenavMenuItems());
    // setTimeout(() => this.seconds = () => this.seconds, 0);
  }

  public closeSubMenus() {
    if (window.innerWidth < 960) {
      this.sidenavMenuService.closeAllSubMenus();
    }
  }
  opennavmenu() {

    if (this.opennav) {
      return this.opennav = false;
    } else if (this.openVehicleNav) {
      this.openVehicleNav = false;
      this.opennav = true;
      return;
    }
    else if (!this.opennav) {
      return this.opennav = true
    }
  }
  openVehicleNavMenu() {
    if (this.openVehicleNav) {
      return this.openVehicleNav = false;
    } else if (this.opennav) {
      this.opennav = false;
      this.openVehicleNav = true;
      return
    }
    else if (!this.openVehicleNav) {
      return this.openVehicleNav = true
    }
  }
}
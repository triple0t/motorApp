import { Component, OnInit, HostListener, ElementRef } from '@angular/core';
import { Select2OptionData } from 'ng2-select2';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgAisModule } from 'angular-instantsearch';
import { environment } from '../../../../environments/environment';
import { Router } from '@angular/router';
import { AppService } from 'src/app/app.service';
import { ProductService } from 'src/app/services/product.service';
import { YMMService } from 'src/app/services/YMM.service';


const optionsa = environment.algolia;
@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],

})

export class MenuComponent implements OnInit {
  searchForm: FormGroup;
  opennav = false;
  openSearchBar = false;
  openVehicleNav = false;
  public showBackToTop = false;
  show = true;
  showDropdown = false;
  text: string;
  triggered = false;
  filteredOptions: Observable<string[]>;
  myControl = new FormControl();
  options: string[] = ['One', 'Two', 'Three'];
  scrolled: boolean;
  SubNavMenu;
  Subtitle;
  mainItems: any[] = [
    { path: '/category/Suspension-59', title: 'Suspension' },
    { path: '/category/Brake+Pad-196', title: 'Brake Pads' },
    { path: '/category/HeatAir Conditioning-55', title: 'Heat & Air Conditioning' },
    { path: '/category/Engine-52', title: 'Engine' },
    { path: '/category/Cooling System-34', title: 'Cooling System' },
    // { path: '/category/Exhaust+Emission-53', title: 'Exhaust & Emission' },
    // { path: '/category/Electrical-48', title: 'Electrical' },
    { path: '/category/Battery-64', title: 'Battery' },
    { path: '/category/Tyre-65', title: 'Tyre' },
    { path: '/category/Wiper+Washer-62', title: 'Wiper & Washer' },
  ];
  mainCategories;
  // any[] = [
  //   { path: '', title: 'Accessories', class: "menu-img menu-image-accessories", id:5 },
  //   { path: '', title: 'Air Conditioning & Heating', class: "menu-img menu-image-ac-and-heating", id:5 },
  //   { path: '', title: 'Alternators &amp; Starters', class: "menu-img menu-image-alternators-and-starters", id:5 },
  //   { path: '', title: 'Battery &amp; Accessories', class: "menu-img menu-image-batteries-and-accessories", id:5},
  //   { path: '', title: 'Bearings &amp; Seals', class: "menu-img menu-image-bearings-and-seals", id:5},
  //   { path: '', title: 'Belts &amp; Hoses', class: "menu-img menu-image-belts-and-hose", id:5},
  //   { path: '', title: 'Brakes', class: "menu-img menu-image-brake", id:5},
  //   { path: '', title: 'Chassis &amp; Steering', class: "menu-img menu-image-chassis-and-steering",id:5 },
  //   { path: '', title: 'CV, Driveshaft &amp; Axle', class: "menu-img menu-image-cv-driveshaft-and-axle", id:5},
  //   { path: '', title: 'Detailing', class: "menu-img menu-image-detailing", id:5},
  //   { path: '', title: 'Engine Cooling', class: "menu-img menu-image-engine-cooling", id:5},
  //   { path: '', title: 'Engine Sensors &amp; Emissions', class: "menu-img menu-image-engine-sensors-and-emissions", id:5},
  //   { path: '', title: 'Engines &amp; Transmissions', class: "menu-img menu-image-engine-and-transmission", id:5},
  //   { path: '', title: 'Exhaust', class: "menu-img menu-image-exhaust", id:5},
  //   { path: '', title: 'Filters', class: "menu-img menu-image-filters", id:5},
  //   { path: '', title: 'Fuel Delivery', class: "menu-img menu-image-fuel-delivery", id:5},
  //   { path: '', title: 'Gaskets', class: "menu-img menu-image-gasket", id:5},
  //   { path: '', title: 'Hardware &amp; Fasteners', class: "menu-img menu-image-hardware-and-fasteners", id:5},
  //   { path: '', title: 'Heavy Duty, Ag &amp; Fleet', class: "menu-img menu-image-heavyduty-ag-and-fleet", id:5},
  //   { path: '', title: 'Ignition &amp; Tune-Up', class: "menu-img menu-image-ignition-tuneup", id:5},
  //   { path: '', title: 'Lawn and Garden', class: "menu-img menu-image-lawn-and-garden",id:5 },
  //   { path: '', title: 'Lighting &amp; Electrical', class: "menu-img menu-image-lighting-electrical", id:5},
  //   { path: '', title: 'Oil, Chemicals &amp; Fluids', class: "menu-img menu-image-oil-chemicals-and-fluid", id:5},
  //   { path: '', title: 'Paint &amp; Body', class: "menu-img menu-image-paint-and-body", id:5},
  //   { path: '', title: 'Performance', class: "menu-img menu-image-oil-chemicals-and-fluids", id:5},
  //   { path: '', title: 'Powersport &amp; Marine', class: "menu-img menu-image-paint-and-body", id:5},
  //   { path: '', title: 'Shocks &amp; Struts', class: "menu-img menu-image-powersports-and-marine",id:5 },
  //   { path: '', title: 'Tire &amp; Wheel', class: "menu-img menu-image-tire-and-wheel", id:5},
  //   { path: '', title: 'Tools &amp; Equipment', class: "menu-img menu-image-tools-and-equipment", id:5},
  //   { path: '', title: 'Truck, Towing &amp; Jeep', class: "menu-img menu-image-truck-towing-and-jeep", id:5},
  //   { path: '', title: 'Wipers &amp; Components', class: "menu-img menu-image-wipers-and-components", id:5},
  // ];

  showSubNav = false;
  showAccessoriesSubNav = false;
  car: any;
  storedCar: any = localStorage.getItem('YMM');


  constructor(
    private eRef: ElementRef,
    public formBuilder: FormBuilder,
    public router: Router,
    public appService: AppService,
    public Prodservice: ProductService,
    public ymm: YMMService) {
    this.getMenu(); }

  ngOnInit() {

    if (!this.storedCar) {
      this.ymm.currentYMM.subscribe(car => {
        console.log('car:', car);
        this.car = car;
      });
    } else {
      this.car = JSON.parse(this.storedCar);
    }

    this.searchForm = new FormGroup({
      search: new FormControl()
   });
  }

  getMenu() {
    this.Prodservice.getMainCat().subscribe(
      response => {
        console.log('menu', response);
        this.mainCategories = response;
      },
      error => console.log(error)
    );
  }
  handleChange(event): void {
    console.log('changed value is ' + event.data[0].id);
  }

  openMegaMenu() {
    const pane = document.getElementsByClassName('cdk-overlay-pane');
    [].forEach.call(pane, function (el) {
      if (el.children.length > 0) {
        if (el.children[0].classList.contains('mega-menu')) {
          el.classList.add('mega-menu-pane');
        }
      }
    });
  }

  start() {
    if (this.showDropdown === false) {
      this.triggered = false;
      console.log('first');
      return this.showDropdown = true;
    } else if (this.showDropdown === true && this.triggered === false) {
      this.triggered = true;
      return this.showDropdown = false;
    } else {
      console.log('whoops');
      return this.showDropdown = false;
    }
  }

  @HostListener('window:scroll', ['$event'])
  onWindowScroll($event) {
    (window.pageYOffset > 20) ? this.scrolled = true : this.scrolled = false;
  }

  onClickedOutside(e: Event) {
    if (this.eRef.nativeElement.contains(e.target)) {
    } else {
      // this.triggered =false
      if (this.showDropdown && this.triggered === true) {
        this.showDropdown = false;
        console.log('non');
        console.log('clicked lllltside');
      }
    }
  }

  opennavmenu() {
    if (this.opennav) {
      return this.opennav = false;
    } else if (this.openVehicleNav) {
      this.openVehicleNav = false;
      this.opennav = true;
      return;
    } else if (!this.opennav) {
      return this.opennav = true;
    }
  }
  openVehicleNavMenu() {
    if (this.openVehicleNav) {
      return this.openVehicleNav = false;
    } else if (this.opennav) {
      this.opennav = false;
      this.openVehicleNav = true;
      return;
    } else if (!this.openVehicleNav) {
      return this.openVehicleNav = true;
    }
  }

  openSearch() {
    if (this.openSearchBar) {
     return this.openSearchBar = false;
   } else if (this.openVehicleNav === true || this.opennav === true) {
     this.openVehicleNav = false;
     this.opennav = false;
     this.openSearchBar = true;
     return;
   } else if (!this.openSearchBar) {
     return this.openSearchBar = true;
   }
 }

 openSubMenu = (input) => {
  this.showSubNav = true;
  this.showAccessoriesSubNav = true;
  // console.log(input);
  this.Prodservice.getSubCat(input.id).subscribe(
    response => {
      // console.log(response)
      this.SubNavMenu = response;
      this.Subtitle = input.title;
    },
    error => console.log(error)
  );
}
closeSubNav () {
  this.showSubNav = false;
  this.showAccessoriesSubNav = false;
}

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.options.filter(option => option.toLowerCase().includes(filterValue));
  }
  onSearchFormSubmit(value) {
      console.warn(value);
      this.router.navigate(['/search'], { queryParams: { search: value.search } });
  }
}

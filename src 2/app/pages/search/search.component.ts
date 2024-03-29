import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { MatDialog } from '@angular/material';
import { ProductDialogComponent } from '../../shared/products-carousel/product-dialog/product-dialog.component';
import { AppService } from '../../app.service';
import { Product, Category } from "../../app.models";
import { NgAisModule } from 'angular-instantsearch';
import 'rxjs/add/operator/filter';
 
@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
  @ViewChild('sidenav') sidenav: any;
  public sidenavOpen:boolean = true;
  private sub: any;
  public viewType: string = 'grid';
  public viewCol: number = 25;
  public counts = [12, 24, 36];
  public count:any;
  public sortings = ['Sort by Default', 'Best match', 'Lowest first', 'Highest first'];
  public sort:any;
  public products: Array<Product> = [];
  public categories:Category[];
  public brands = [];
  public priceFrom: number = 750;
  public priceTo: number = 1599;
  public colors = ["#5C6BC0","#66BB6A","#EF5350","#BA68C8","#FF4081","#9575CD","#90CAF9","#B2DFDB","#DCE775","#FFD740","#00E676","#FBC02D","#FF7043","#F5F5F5","#000000"];
  public sizes = ["S","M","L","XL","2XL","32","36","38","46","52","13.3\"","15.4\"","17\"","21\"","23.4\""];
  public page:any;
  cate;
  countss = 8;
  configOption;
  searchParameters;
  translate;
  search = "All Products";

  constructor(public NgAisModule:NgAisModule, private activatedRoute: ActivatedRoute, 
    public appService:AppService, public dialog: MatDialog, private router: Router) {
    // For algolia
  }

  ngOnInit() {
    if (this.activatedRoute.snapshot.queryParams['search']) {
        this.activatedRoute.queryParams
          .filter(params => params.search)
          .subscribe(params => {
            // console.log(params); // {order: "popular"}
              this.search = params.search,
              console.log(this.search) // popular
              this.configOption = environment.algolia; 
              this.searchParameters = {
                hitsPerPage: this.countss,
                query:this.search,
              };
        });
    }else{
      // console.log('Heyoo'); 
      this.router.navigate(['/404']);
    }
    // console.log(this.searchParameters, this.cate) 
    this.count = this.counts[0];
    this.sort = this.sortings[0];
    if(window.innerWidth < 960){
      this.sidenavOpen = false;
    };
    if(window.innerWidth < 1280){
      this.viewCol = 33.3;
    };

    this.getCategories();
    this.getBrands();
    this.getProducts();   
  }

  public getAllProducts(){
    this.appService.getProducts("featured").subscribe(data=>{
      this.products = data; 
      //for show more product  
      for (var index = 0; index < 3; index++) {
        this.products = this.products.concat(this.products);        
      }
    });
  }

  public getProducts(){
    // For algolia
    this.sub = this.activatedRoute.params.subscribe(params => {
      this.configOption = environment.algolia; 
        this.searchParameters = {
          hitsPerPage: this.countss,
          query:this.search,
        };
      });
  }
  public getCategories(){  
    if(this.appService.Data.categories.length == 0) { 
      this.appService.getCategories().subscribe(data => {
        this.categories = data;
        this.appService.Data.categories = data;
      });
    }
    else{
      this.categories = this.appService.Data.categories;
    }
  }

  public getBrands(){
    this.brands = this.appService.getBrands();
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  @HostListener('window:resize')
  public onWindowResize():void {
    (window.innerWidth < 960) ? this.sidenavOpen = false : this.sidenavOpen = true;
    (window.innerWidth < 1280) ? this.viewCol = 33.3 : this.viewCol = 25;
  }

  // public changeCount(count){
  //   this.count = count;
  //   this.getAllProducts(); 
  // }
  public changeCount(count){
    this.countss = count;
  }

  public changeSorting(sort){
    this.sort = sort;
  }

  public changeViewType(viewType, viewCol){
    this.viewType = viewType;
    this.viewCol = viewCol;
  }

  public openProductDialog(product){   
    let dialogRef = this.dialog.open(ProductDialogComponent, {
        data: product,
        panelClass: 'product-dialog'
    });
    dialogRef.afterClosed().subscribe(product => {
      if(product){
        this.router.navigate(['/products', product.id, product.name]); 
      }
    });
  }

  public onPageChanged(event){
      this.page = event;
      this.getAllProducts(); 
      window.scrollTo(0,0); 
  }

  public onChangeCategory(event){
    if(event.target){
      this.router.navigate(['/products', event.target.innerText.toLowerCase()]); 
    }   
  }
  
  public toDetails(objectID, sku){
    this.router.navigate(['/product', objectID, sku])
  }

  public mouseEnter(event){
    event.target.classList.add('animate');
  }

  public mouseLeave(event){
    event.target.classList.remove('animate');
  }

}



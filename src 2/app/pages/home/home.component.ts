import { Component, OnInit } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { AppService } from '../../app.service';
import { ProductService } from '../../services/product.service';
import { Product } from "../../app.models";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  public slides = [
    { title: '', subtitle: '', image: 'assets/images/carousel/banner1.jpg' },
    { title: '', subtitle: '', image: 'assets/images/carousel/banner2.jpg' },
    { title: '', subtitle: '', image: 'assets/images/carousel/banner3.jpg' },
    { title: '', subtitle: '', image: 'assets/images/carousel/banner4.jpg' }
  ];
  public slides_mobile = [
    { title: '', subtitle: '', image: 'assets/images/carousel/Mobile1.jpg' },
    { title: '', subtitle: '', image: 'assets/images/carousel/Mobile2.jpg' },
    { title: '', subtitle: '', image: 'assets/images/carousel/Mobile3.jpg' },
    { title: '', subtitle: '', image: 'assets/images/carousel/Mobile4.jpg' }
  ];

  public slides_tab = [
    { title: '', subtitle: '', image: 'assets/images/carousel/Tab1.jpg' },
    { title: '', subtitle: '', image: 'assets/images/carousel/Tab2.jpg' },
    { title: '', subtitle: '', image: 'assets/images/carousel/Tab3.jpg' },
    { title: '', subtitle: '', image: 'assets/images/carousel/Tab4.jpg' }
  ];

  public brands = [];
  public banners = [];
  public featuredProducts;
  public onSaleProducts;
  public topRatedProducts;
  public newArrivalsProducts;
  title = 'Motormata - ';

  constructor(public appService:AppService, public productService:ProductService, 
    private titleService: Title, private meta: Meta) { }

  ngOnInit() {
    this.getBanners();
    this.getProducts("featured");
    this.getBrands();
    
  	this.titleService.setTitle(this.title);
  	this.meta.addTag({name: 'keywords', content: 'Motormata, Motor Parts'});
    this.meta.addTag({name: 'description', content: 'Motormata sells parts'});
  }

  public onLinkClick(e){
    this.getProducts(e.tab.textLabel.toLowerCase()); 
  }

  public getProducts(type){
    if(type == "featured" && !this.featuredProducts){
      // this.appService.getProducts("featured").subscribe(data=>{
        this.productService.getProduct("featured").subscribe(response=>{
        let res;
        res = response;      
        this.featuredProducts = res.data;
        // console.log(this.featuredProducts)
      }) 
    }
    if(type == "battery" && !this.onSaleProducts){
      // this.appService.getProducts("on-sale").subscribe(data=>{
        this.productService.getProduct("Battery").subscribe(response=>{
          let res;
          res = response;      
          this.onSaleProducts = res.data;
          // console.log(this.onSaleProducts)
      })
    }
    if(type == "tyre" && !this.topRatedProducts){
      // this.appService.getProducts("top-rated").subscribe(data=>{
        this.productService.getProduct("Tyre").subscribe(response=>{
          let res;
          res = response;      
        this.topRatedProducts = res.data;      
      })
    }
    if(type == "strut" && !this.newArrivalsProducts){
      // this.appService.getProducts("new-arrivals").subscribe(data=>{
        this.productService.getProduct("Strut").subscribe(response=>{
          let res;
          res = response;      
        this.newArrivalsProducts = res.data;      
      })
    }
   
  }

  public getBanners(){
    this.appService.getBanners().subscribe(data=>{
      this.banners = data;
    })
  }

  public getBrands(){
    this.brands = this.appService.getBrands();
  }

}

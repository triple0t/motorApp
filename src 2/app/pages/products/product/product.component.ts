import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { SwiperConfigInterface, SwiperDirective } from 'ngx-swiper-wrapper';
import { Data, AppService } from '../../../app.service';
import { Product } from "../../../app.models";
import { emailValidator } from '../../../theme/utils/app-validators';
import { ProductZoomComponent } from './product-zoom/product-zoom.component';
import { CustomerService } from 'src/app/services/customer/customer.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})

export class ProductComponent implements OnInit {
  @ViewChild('zoomViewer') zoomViewer;
  @ViewChild(SwiperDirective) directiveRef: SwiperDirective;
  public config: SwiperConfigInterface={};
  public product = <any>[];
  public image: any;
  productL = false;
  prodDesc;
  prodSDesc;
  magelk = 'http://142.93.242.246/pub/media/catalog/product/';
  public zoomImage: any;
  private sub: any;
  public form: FormGroup;
  public relatedProducts:any;

  constructor(public appService:AppService, public customerService:CustomerService, 
    private activatedRoute: ActivatedRoute, public dialog: MatDialog, public formBuilder: FormBuilder) { 
      this.sub = this.activatedRoute.params.subscribe(params => { 
        // this.getProductBySku(params['name']); 
        this.getProductById(params['id']); 
        this.getRelatedProducts(params['id']);    
      }); 
     }

  ngOnInit() {      

    this.form = this.formBuilder.group({ 
      'review': [null, Validators.required],            
      'name': [null, Validators.compose([Validators.required, Validators.minLength(4)])],
      'email': [null, Validators.compose([Validators.required, emailValidator])]
    }); 

  }

  ngAfterViewInit(){
    this.config = {
      observer: false,
      slidesPerView: 4,
      spaceBetween: 10,      
      keyboard: true,
      navigation: true,
      pagination: false,       
      loop: false, 
      preloadImages: false,
      lazy: true, 
      breakpoints: {
        480: {
          slidesPerView: 2
        },
        600: {
          slidesPerView: 3,
        }
      }
    }
  }

  public getProductById(id){
    this.customerService.getProduct(id).subscribe(response=>{
      this.product = response.data;
      this.productL = true;
      // this.getDescription();
      // this.getSDescription();
      // console.log(response.data, id);
    // this.appService.getProductById(id).subscribe(data=>{
      // this.product = data;
      // this.productL = true;
      // this.image = data.images[0].medium;
      // this.zoomImage = data.images[0].big;
      // setTimeout(() => { 
      //   this.config.observer = true;
      //  // this.directiveRef.setIndex(0);
      // });
    });
  }

  public getProductBySku(sku){
    this.customerService.getProduct(sku).subscribe(response=>{
      // this.product = response;
      // this.productL = true;
      // this.getDescription();
      // this.getSDescription();
      console.log(response, sku);
    })
  }
  public getRelatedProducts(id){
    // this.appService.getProducts('related').subscribe(data => {
    //   this.relatedProducts = data;
    // })
    this.customerService.getRelatedProducts(id).subscribe(data=>{
      console.log(data['data']);
      this.relatedProducts = data['data'];
    })
  }

  // public getPmages(){
  //   // console.log(this.product);
  //   this.image = this.magelk+this.product.media_gallery_entries[0].file;
  //   this.zoomImage  = this.magelk+this.product.media_gallery_entries[0].file;
  //   return this.product.media_gallery_entries;
  // }

  // getDescription(){
  //   // console.log(this.product.custom_attributes)
  //   let des = this.product.custom_attributes
  //   des.forEach(desc => {
  //     if(desc.attribute_code === "description"){
  //       // console.log(desc.value)
  //       this.prodDesc = desc.value
  //     }
  //   });
  // }
  // getSDescription(){
  //   // console.log(this.product.custom_attributes)
  //   let des = this.product.custom_attributes
  //   des.forEach(desc => {
  //     if(desc.attribute_code === "short_description"){
  //       console.log(desc.value)
  //       this.prodSDesc = desc.value
  //     }
  //   });
  // }

  public getAvaliability(){
    return this.product.extension_attributes.stock_item.qty;
  }
  public selectImage(image){
    this.image = this.magelk+image;
    this.zoomImage = this.magelk+image;
  }

  public onMouseMove(e){
    if(window.innerWidth >= 1280){
      var image, offsetX, offsetY, x, y, zoomer;
      image = e.currentTarget; 
      offsetX = e.offsetX;
      offsetY = e.offsetY;
      x = offsetX/image.offsetWidth*100;
      y = offsetY/image.offsetHeight*100;
      zoomer = this.zoomViewer.nativeElement.children[0];
      if(zoomer){
        zoomer.style.backgroundPosition = x + '% ' + y + '%';
        zoomer.style.display = "block";
        zoomer.style.height = image.height + 'px';
        zoomer.style.width = image.width + 'px';
      }
    }
  }

  // public onMouseLeave(event){
  //   this.zoomViewer.nativeElement.children[0].style.display = "none";
  // }

  // public openZoomViewer(){
  //   this.dialog.open(ProductZoomComponent, {
  //     data: this.zoomImage,
  //     panelClass: 'zoom-dialog'
  //   });
  // }

  ngOnDestroy() {
    this.sub.unsubscribe();
  } 

  public onSubmit(values:Object):void {
    if (this.form.valid) {
      //email sent
    }
  }
}
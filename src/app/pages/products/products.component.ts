import { Component, OnInit, ViewChild, HostListener, ViewEncapsulation, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Title, Meta } from '@angular/platform-browser';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { environment } from '../../../environments/environment';
import { MatDialog } from '@angular/material';
import { ProductDialogComponent } from '../../shared/products-carousel/product-dialog/product-dialog.component';
import { AppService } from '../../app.service';
import { Product, Category } from '../../app.models';
import { MatSnackBar } from '@angular/material';
import { NgAisModule } from 'angular-instantsearch';
import { emailValidator } from '../../theme/utils/app-validators';
import { NgxSpinnerService } from 'ngx-spinner';
import { YMMService } from 'src/app/services/YMM.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
})
export class ProductsComponent implements OnInit, OnDestroy {
  @ViewChild('sidenav') sidenav: any;
  public useCar = false;
  public sidenavOpen = true;
  private sub: any;
  public viewType = 'grid';
  public viewCol = 25;
  public counts = [12, 24, 36];
  public count: any;
  public sortings = ['Sort by Default', 'Best match', 'Lowest first', 'Highest first'];
  public sort: any;
  public products: Array<Product> = [];
  public categories: Category[];
  public brands = [];
  public priceFum = 750;
  public priceTo = 1599;
  public colors = ['#5C6BC0', '#66BB6A', '#EF5350', '#BA68C8', '#FF4081', '#9575CD', '#90CAF9',
  '#B2DFDB', '#DCE775', '#FFD740', '#00E676', '#FBC02D', '#FF7043', '#F5F5F5', '#000000'];
  public sizes = ['S', 'M', 'L', 'XL', '2XL', '32', '36', '38', '46', '52', '13.3\"', '15.4"', '17"', '21"', '23.4"'];
  public page: any;
  cate;
  carselect;
  countss = 8;
  configOption;
  configOption2;
  searchParameters;
  searchParameters2;
  translate;
  carForm: FormGroup;
  status = false;
  showAll = false;
  


  constructor(
    public formBuilder: FormBuilder,
    public snackBar: MatSnackBar,
    private spinner: NgxSpinnerService,
    public ngAisModule: NgAisModule,
    private activatedRoute: ActivatedRoute,
    public appService: AppService,
    public dialog: MatDialog,
    private router: Router,
    public YMM: YMMService,
    private titleService: Title, private meta: Meta) {
  // For algolia

  }

  ngOnInit() {
    // console.log(this.searchParameters, this.cate)
    this.count = this.counts[0];
    this.sort = this.sortings[0];
    if (window.innerWidth < 960) {
      this.sidenavOpen = false;
    }
    if (window.innerWidth < 1280) {
      this.viewCol = 33.3;
    }
    this.carForm = this.formBuilder.group({
      'email': ['', Validators.compose([Validators.required, emailValidator])]
    });

    // this.getCategories();
    // this.getBrands();
    this.sub = this.activatedRoute.params.subscribe(params => {
      this.setMeta(params['name'].split('-')[1])
    });
    this.getProducts();
  }
  public setMeta(id){
    this.YMM.getMeta(id).subscribe(
      response=>{
        // console.log(response['meta_title']), 
        this.titleService.setTitle('Motormata || '+response['meta_title']);
        this.meta.addTag({name: 'keywords', content: response['meta_keywords']});
        this.meta.addTag({name: 'description', content: response['meta_title'] + response['meta_keywords']});
      }
    )
  }
  
  public ratingcount(sku){
    // console.log(sku.split('-')[0]);
    this.YMM.getReview(sku.split('-')[0]).subscribe(
      response=>{ 
        if(response.length == 0){
          return 3;
        }else{
        return response[0].rating;
        }
      })
  }

  public getProducts() {
    if (localStorage.getItem('CarYMM')) {
      const car = this.appService.getCar();
      console.log(car);
      this.carselect = true;

      // For algolia
      this.sub = this.activatedRoute.params.subscribe(params => {
        this.configOption = environment.algolia;
        this.searchParameters = {
          hitsPerPage: this.countss,
          filters: 'categoryIds:' + params['name'].split('-')[1] + ' AND fits:' + car,
        };
        let paa = params['name'].split('-')[1]
        // if(paa == 64){
          // console.log('wow', params['name'])  
          this.configOption = environment.algolia;
            this.searchParameters = {
                // query:"Toyota-Corolla-ALL-2011",
                query:car,
                queryType: 'prefixNone',
                minWordSizefor1Typo:'1',
                hitsPerPage: this.countss,
                restrictSearchableAttributes: "fits",
                filters: "categoryIds:"+ params['name'].split('-')[1],
                // minProximity: ,
                // advancedSyntax: true,  
                typoTolerance:'strict',
                enableRules: 'true',
                distinct:1,
                removeWordsIfNoResults:'none'
                // exactOnSingleWordQuery: 'word',
                // exactOnSingleWordQuery: 'none',
          };
      // }else{
        //   console.log('wo0ew', params['name'])  
        //   this.configOption = environment.algolia;
        //     this.searchParameters = {
        //       // query:"Toyota-Corolla-ALL-2011",
        //       // query:car,
        //       hitsPerPage: this.countss,
        //       minProximity: 7,
        //       advancedSyntax: true,
        //       // exactOnSingleWordQuery: 'word',
        //       exactOnSingleWordQuery: 'none',
        //       // restrictSearchableAttributes: "fits",
        //       filters: "categoryIds:"+ params['name'].split('-')[1],
        //     };
        // }

        this.configOption2 = environment.algoliacat;
        this.searchParameters2 = {
          hitsPerPage: this.countss,
          filters: 'objectID:' + params['name'].split('-')[1],
        };
      });
      // For algolia
      // this.sub = this.activatedRoute.params.subscribe(params => {
      //   this.configOption = environment.algolia;
      //     this.searchParameters = {
      //       hitsPerPage: this.countss,
      //       filters: "categoryIds:"+ params['name'].split('/')[1]+" AND fits:"+car,
      //     };
      //   });
    }else{
      // console.log("hmm");
      this.carselect =false;
      // For algolia
      this.sub = this.activatedRoute.params.subscribe(params => {
        this.configOption = environment.algolia;
        this.searchParameters = {
          hitsPerPage: this.countss,
          filters: 'categoryIds:' + params['name'].split('-')[1],
        };

        this.configOption2 = environment.algoliacat;
        this.searchParameters2 = {
          hitsPerPage: this.countss,
          filters: 'objectID:' + params['name'].split('-')[1],
        };
      });
    }
  }
  public getCategories() {
    if (this.appService.Data.categories.length == 0) {
      this.appService.getCategories().subscribe(data => {
        this.categories = data;
        this.appService.Data.categories = data;
      });
    } else {
      this.categories = this.appService.Data.categories;
    }
  }

  public getBrands() {
    this.brands = this.appService.getBrands();
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  @HostListener('window:resize')
  public onWindowResize(): void {
    (window.innerWidth < 960) ? this.sidenavOpen = false : this.sidenavOpen = true;
    (window.innerWidth < 1280) ? this.viewCol = 33.3 : this.viewCol = 25;
  }

  // public changeCount(count){
  //   this.count = count;
  //   this.getAllProducts();
  // }
  public changeCount(count) {
    this.countss = count;
  }

  public changeSorting(sort) {
    this.sort = sort;
  }

  public changeViewType(viewType, viewCol) {
    this.viewType = viewType;
    this.viewCol = viewCol;
  }

  public openProductDialog(product) {
    const dialogRef = this.dialog.open(ProductDialogComponent, {
      data: product,
      panelClass: 'product-dialog'
    });
    dialogRef.afterClosed().subscribe(product => {
      if (product) {
        this.router.navigate(['/products', product.id, product.name]);
      }
    });
  }

  public onPageChanged(event) {
    this.page = event;
    this.getProducts();
    window.scrollTo(0, 0);
  }

  public onChangeCategory(event) {
    if (event.target) {
      this.router.navigate(['/products', event.target.innerText.toLowerCase()]);
    }
  }
  public toDetails(objectID, sku) {
    this.router.navigate(['/product', objectID, sku]);
  }

  public mouseEnter(event) {
    event.target.classList.add('animate');
  }

  public mouseLeave(event) {
    event.target.classList.remove('animate');
  }

  logMessageId(el){

    let messageId = el.getAttribute('data-message-id');
    //let messageId = el.dataset.messageId;
    console.log("Message Id: ", messageId);

  }
  
  public onCarFormSubmit(values:Object):void { 
    this.spinner.show();
    if (this.carForm.valid) {
      // this.router.navigate(['/']);
      localStorage.clear();
      this.YMM.saveEmail(this.carForm.value.email)
      .subscribe(
        response => {
          console.log(response);
          // this.AuthService.setToken(res['token']);
          this.router.navigateByUrl('/account');
          this.spinner.hide();
          var message = 'Logged in Successfully.';
          var status = 'success'; 
          this.snackBar.open(message, '×', { panelClass: [status], verticalPosition: 'top', duration: 3000 });
          // location.reload();
        },
        error => {
          console.log(error);
          this.spinner.hide();
          var message = 'invalid Credientials'; 
          var status = 'error'; 
          this.snackBar.open(message, '×', { panelClass: [status], verticalPosition: 'top', duration: 3000 });
          // location.reload();
        }
      );
    }
  }

  public checktags(str) {
    if (str) {
      const length = (str.match(/<\/p>/g) || []).length;
      return length;
    } else {
      return;
    }
  }

  public removeLongString(word) {
    if (word) {
      const splitWord = word.split('</p>');
      let newWord = '';
      for (let i = 0; i < 4; i++) {
        newWord += splitWord[i] + '</p>';
      }
      return newWord;
    } else {
      return;
    }
  }

  toggle () {
    this.showAll = !this.showAll;
  }

}

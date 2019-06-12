import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { MatSnackBar } from '@angular/material';
import { Category, Product } from './app.models';
import { AuthService } from './services/auth/auth.service';
import { CartService } from './services/cart/cart.service';
import { NgxSpinnerService } from 'ngx-spinner';
import * as cryptoJS from 'crypto-js';
import { environment } from '../environments/environment';
import { DomSanitizer } from '@angular/platform-browser';
import { getToken } from '@angular/router/src/utils/preactivation';

const secret = environment.secret;
export class Data {
    constructor(
                public categories: Category[],
                public compareList: Product[],
                public wishList: Product[],
                public cartList:Product[],
                public Cart:Product[],
                public totalPrice: number,
                public totalCartCount: number,) {  }
}
@Injectable()
export class AppService {
    public Data = new Data(
        [], // categories
        [], // compareList
        [],  // wishList
        [],  // cartList
        [],
        null, //totalPrice,
        0 //totalCartCount
    )
    public url = "assets/data/";
    public totalCartNo = 0;
    public Cartitems:[];
    guestCartid;
    constructor(public http:HttpClient, public snackBar: MatSnackBar,
        private authService:AuthService, private cartService:CartService, 
        private spinner: NgxSpinnerService) { }
    
    public cartitems =<any>[];
    public getCategories(): Observable<Category[]>{
        return this.http.get<Category[]>(this.url + 'categories.json');
    }
   
    public getProducts(type): Observable<Product[]>{        
        return this.http.get<Product[]>(this.url + type + '-products.json');
    }

    public getProductById(id): Observable<Product>{
        return this.http.get<Product>(this.url + 'product-' + id + '.json');
    }

    public getBanners(): Observable<any[]>{
        return this.http.get<any[]>(this.url + 'banners.json');
    }  

    public addToCompare(product:Product){
        let message, status;
        if(this.Data.compareList.filter(item=>item.id == product.id)[0]){
            message = 'The product ' + product.name + ' already added to comparison list.'; 
            status = 'error';     
        }
        else{
            this.Data.compareList.push(product);
            message = 'The product ' + product.name + ' has been added to comparison list.'; 
            status = 'success';  
        }
        this.snackBar.open(message, '×', { panelClass: [status], verticalPosition: 'top', duration: 3000 });
    }

    public addToWishList(product:Product){
        // let message, status;
        // if(this.Data.wishList.filter(item=>item.id == product.id)[0]){
        //     message = 'The product ' + product.name + ' already added to wish list.'; 
        //     status = 'error';     
        // }
        // else{
        //     this.Data.wishList.push(product);
        //     message = 'The product ' + product.name + ' has been added to wish list.'; 
        //     status = 'success';  
        // }
        // this.snackBar.open(message, '×', { panelClass: [status], verticalPosition: 'top', duration: 3000 });
    }

    getCar(){
        var token= localStorage.getItem('CarYMM');
        var bytes  = cryptoJS.AES.decrypt(token, secret);
        var CarMake  =JSON.parse(bytes.toString(cryptoJS.enc.Utf8))
        return CarMake;
    }

    public async getCart(){
        let message, status;
        if(this.authService.isLoggedIn()){
            if(localStorage.getItem('cart_user_id')){
                let quote = this.cartService.getQuote();
                this.cartService.getCartItems(quote.quote_id).subscribe(
                    response=>{
                    this.cartitems = response,
                    this.totalCartNo = this.cartitems.length;
                    // console.log(this.totalCartNo, this.cartitems)
                    }, error=>console.log(error)
                );
            }else{
                this.cartService.createCart().subscribe(response => {
                    // console.log(response)
                    let quote = this.cartService.getQuote();
                    this.cartService.getCartItems(quote.quote_id).subscribe(
                        response=>{
                        this.cartitems = response,
                        this.totalCartNo = this.cartitems.length;
                        // console.log(this.totalCartNo, this.cartitems)
                        }, error=>console.log(error)
                    );
                }, error=>console.log(error));
                }
        }else{
            if(localStorage.getItem('guest_cart')){
                let quote = this.cartService.getQuote();
                this.cartService.getCartItems(quote.quote_id).subscribe(
                    response=>{
                    this.cartitems = response,
                    this.totalCartNo = this.cartitems.length;
                    // console.log(this.totalCartNo, this.cartitems)
                    }, error=>console.log(error)
                );                
            }else{
                this.cartService.createCart().subscribe(response => {
                    // console.log(response)
                    let quote = this.cartService.getQuote();
                    this.cartService.getCartItems(quote.quote_id).subscribe(
                        response=>{
                        this.cartitems = response,
                        this.totalCartNo = this.cartitems.length;
                        // console.log(this.totalCartNo, this.cartitems)
                        }, error=>console.log(error)
                    );
                });
            }
        }
    }

    public loadCart(){
       return this.cartitems = this.cartService.getCarts()       
    }

    public async addToCart(product){
        // await this.getCart();
        let message, status;
        if(this.authService.isLoggedIn()){
            if(localStorage.getItem('cart_user_id')){
                let qty =  product.cartCount, sku = product.sku
                let quote = this.cartService.getQuote(), quote_id = quote.quote_id;
                this.cartService.addToCart(sku, qty, quote_id).subscribe(
                    response => {
                        this.getCart();
                        this.spinner.hide(),
                        message = 'The product ' + product.name + ' has been added to cart.'; 
                        status = 'success';          
                        this.snackBar.open(message, '×', { panelClass: [status], verticalPosition: 'top', duration: 3000 });
                    }, 
                    error =>{ 
                        this.getCart();
                        console.log(error, sku,qty, quote.quote_id),
                        message = 'Error Occurred Try again.'; 
                        status = 'error';          
                        this.snackBar.open(message, '×', { panelClass: [status], verticalPosition: 'top', duration: 3000 });
                    });
            }
            else{
                let qty =  product.cartCount, sku = product.sku
                this.cartService.createCart().subscribe(response => {
                    // console.log(response)
                    let quote = this.cartService.getQuote(), quote_id = quote.quote_id;
                    this.cartService.addToCart(sku, qty, quote_id).subscribe(
                        response => {
                            this.getCart();
                            this.spinner.hide(),
                            message = 'The product ' + product.name + ' has been added to cart.'; 
                            status = 'success';          
                            this.snackBar.open(message, '×', { panelClass: [status], verticalPosition: 'top', duration: 3000 });
                        }, 
                        error =>{ 
                            this.getCart();
                            console.log(error, sku,qty, quote.quote_id),
                            message = 'Error Occurred Try again.'; 
                            status = 'error';          
                            this.snackBar.open(message, '×', { panelClass: [status], verticalPosition: 'top', duration: 3000 });
                        });
                },
                error => console.log(error)
                );
            }
        }else{
            let message, status;
            let qty =  product.cartCount, sku = product.sku
            if(this.cartService.isguest()){
                let quote = this.cartService.getQuote(), quote_id = quote.quote_id;
                this.cartService.addToCart(sku, qty, quote_id).subscribe(
                    response => {
                        this.getCart();
                        this.spinner.hide(),
                        message = 'The product ' + product.name + ' has been added to cart.'; 
                        status = 'success';          
                        this.snackBar.open(message, '×', { panelClass: [status], verticalPosition: 'top', duration: 3000 });
                    }, 
                    error =>{ 
                        this.getCart();
                        console.log(error, sku,qty, quote.quote_id),
                        message = 'Error Occurred Try again.'; 
                        status = 'error';          
                        this.snackBar.open(message, '×', { panelClass: [status], verticalPosition: 'top', duration: 3000 });
                    }
                    );
            }else{
                this.cartService.createCart().subscribe(response => {
                    // console.log(response)
                    let quote = this.cartService.getQuote(), quote_id = quote.quote_id;
                    this.cartService.addToCart(sku, qty, quote_id).subscribe(
                        response => {
                            this.getCart();
                            this.spinner.hide(),
                            message = 'The product ' + product.name + ' has been added to cart.'; 
                            status = 'success';          
                            this.snackBar.open(message, '×', { panelClass: [status], verticalPosition: 'top', duration: 3000 });
                        }, 
                        error =>{ 
                            this.getCart();
                            console.log(error, sku,qty, quote.quote_id),
                            message = 'Error Occurred Try again.'; 
                            status = 'error';          
                            this.snackBar.open(message, '×', { panelClass: [status], verticalPosition: 'top', duration: 3000 });
                        }
                        );
                },
                error => console.log(error)
                );
            }
        }
                
    }

    public resetProductCartCount(product:Product){
        product.cartCount = 0;
        let compareProduct = this.Data.compareList.filter(item=>item.id == product.id)[0];
        if(compareProduct){
            compareProduct.cartCount = 0;
        };
        let wishProduct = this.Data.wishList.filter(item=>item.id == product.id)[0];
        if(wishProduct){
            wishProduct.cartCount = 0;
        }; 
    }

    public getBrands(){
        return [  
            { name: 'aloha', image: 'assets/images/brands/aloha.png' },
            { name: 'dream', image: 'assets/images/brands/dream.png' },  
            { name: 'congrats', image: 'assets/images/brands/congrats.png' },
            { name: 'best', image: 'assets/images/brands/best.png' },
            { name: 'original', image: 'assets/images/brands/original.png' },
            { name: 'retro', image: 'assets/images/brands/retro.png' },
            { name: 'king', image: 'assets/images/brands/king.png' },
            { name: 'love', image: 'assets/images/brands/love.png' },
            { name: 'the', image: 'assets/images/brands/the.png' },
            { name: 'easter', image: 'assets/images/brands/easter.png' },
            { name: 'with', image: 'assets/images/brands/with.png' },
            { name: 'special', image: 'assets/images/brands/special.png' },
            { name: 'bravo', image: 'assets/images/brands/bravo.png' }
        ];
    }

    public getCountries(){
        return [ 
            {name: 'Nigeria', code: 'NG'}
        ]
    }

    public getMonths(){
        return [
            { value: '01', name: 'January' },
            { value: '02', name: 'February' },
            { value: '03', name: 'March' },
            { value: '04', name: 'April' },
            { value: '05', name: 'May' },
            { value: '06', name: 'June' },
            { value: '07', name: 'July' },
            { value: '08', name: 'August' },
            { value: '09', name: 'September' },
            { value: '10', name: 'October' },
            { value: '11', name: 'November' },
            { value: '12', name: 'December' }
        ]
    }

    public getYears(){
        return ["2018", "2019", "2020", "2021", "2022", "2023", "2024", "2025", "2026", "2027", "2028", "2029", "2030" ]
    }
    public getStates(){
        return [
            {name: "Abia"},
            {name: "Adamawa"},
            {name: "Anambra"},
            {name: "Akwa Ibom"},
            {name: "Bauchi"},
            {name: "Bayelsa"},
            {name: "Benue"},
            {name: "Borno"},
            {name: "Cross River"},
            {name: "Delta"},
            {name: "Ebonyi"},
            {name: "Enugu"},
            {name: "Edo"},
            {name: "Ekiti"},
            {name: "FCT - Abuja"},
            {name: "Gombe"},
            {name: "Imo"},
            {name: "Jigawa"},
            {name: "Kaduna"},
            {name: "Kano"},
            {name: "Katsina"},
            {name: "Kebbi"},
            {name: "Kogi"},
            {name: "Kwara"},
            {name: "Lagos"},
            {name: "Nasarawa"},
            {name: "Niger"},
            {name: "Ogun"},
            {name: "Ondo"},
            {name: "Osun"},
            {name: "Oyo"},
            {name: "Plateau"},
            {name: "Rivers"},
            {name: "Sokoto"},
            {name: "Taraba"},
            {name: "Yobe"},
            {name: "Zamfara"}
          ];
    }
    getCountryCode(state){
        this.cartService.getState(state).subscribe(
            response => {console.log(response)},
            error => {console.log(error)}
        )
    }

    public getDeliveryMethods(){
        return [
            { value: 'free', name: 'Free Delivery', desc: '$0.00 / Delivery in 7 to 14 business Days' },
            { value: 'standard', name: 'Standard Delivery', desc: '$7.99 / Delivery in 5 to 7 business Days' },
            { value: 'express', name: 'Express Delivery', desc: '$29.99 / Delivery in 1 business Days' }
        ]
    }

    getshipping(data:string){
        console.log(data)
    }
    
} 
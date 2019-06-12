import { Component, OnInit } from '@angular/core';
import { Data, AppService } from '../../app.service';
import { CartService } from '../../services/cart/cart.service';
import { AuthService } from '../../services/auth/auth.service';
import { DomSanitizer } from '@angular/platform-browser';
import { CustomerService } from 'src/app/services/customer/customer.service';
import { environment } from '../../../environments/environment';
import { NgxSpinnerService } from 'ngx-spinner';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {
  total = [];
  grandTotal = 0;
  cartItemCount = [];
  cartItemCountTotal = 0;
  totalCartNo = 0;
  cartitems = <any>[];  
  dangerousUrl;
  loading=<boolean>false;
  trustedUrl;
  mage_url = environment.api.base_url_mage;
  mage;
  base_url_mage = environment.api.base_url_mage;
  guestCartid;
  discount:number=0;
  
  constructor(public appService:AppService, public authService:AuthService, public cartService:CartService, public snackBar: MatSnackBar,
    private spinner: NgxSpinnerService, public customerService:CustomerService) {
      // this.getCart()
      this.reloadCart()
     }
  token;

  ngOnInit() {
      // console.log(this.cartitems.length);
      // this.appService.getCart();
      // this.getCarttotal()
  }

  async reloadCart(){
    // this.loading = false;
    this.getCart();
    this.appService.getCart()
  }

  public async remove(prod){
    let message, status;
    this.loading = true;
    let quote = this.cartService.getQuote();
    this.cartService.removeFromCart(prod.sku, quote.quote_id)
    .subscribe(
      response => {
        console.log(response)
        this.reloadCart(),
        this.spinner.hide()
        // message = 'The product ' + prod.name + ' has been removed to cart.'; 
        // status = 'success';          
        // this.snackBar.open(message, '×', { panelClass: [status], verticalPosition: 'top', duration: 3000 });
      },
        error => {
          console.log(error),
          this.reloadCart(),
          this.spinner.hide()
          // message = 'Error Occurred Try again.'; 
          // status = 'error';          
          // this.snackBar.open(message, '×', { panelClass: [status], verticalPosition: 'top', duration: 3000 });
        }
        );
  }

  public async clear(prod){
    prod.forEach(ele => {
      this.remove(ele);
      this.reloadCart();
    });
  }
  
  public async getCarttotal(){
    this.grandTotal =0;
    this.cartitems.forEach(product=>{
      let total = product.qty*product.price
      this.grandTotal += total;
      // console.log(this.grandTotal,this.cartService.loadUser());
    })
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
                this.getCarttotal()
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
                    this.getCarttotal()
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
                  this.getCarttotal()
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
                      this.getCarttotal()
                    // console.log(this.totalCartNo, this.cartitems)
                    }, error=>console.log(error)
                );
            });
        }
    }
  }
  
}

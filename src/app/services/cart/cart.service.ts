import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import { AuthService } from '../auth/auth.service';
import { environment } from '../../../environments/environment';
import * as cryptoJS from 'crypto-js';
import { DomSanitizer } from '@angular/platform-browser';

const secret = environment.secret;
@Injectable({
  providedIn: 'root'
})
export class CartService {

  constructor(private http: HttpClient, public authService:AuthService, private sanitizer: DomSanitizer,) { }

public cartitems =<any>[];
public totalCartNo = 0;
dangerousUrl;
trustedUrl;
mage_url = environment.api.base_url_mage;

  getCartItems(quote:string){
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest'});
      let params = new HttpParams().set("quote", quote);
    let options = { headers: headers, params:params};
    return this.http.get(environment.api.base_api_url+'/api/cart/product/items',
     options);
  }

  addToCart(sku:string, qty:string, quote_id:string){
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest'});
      let options = { headers: headers};
    return this.http.post(environment.api.base_api_url+'/api/cart/product/add', 
    {qty:qty, sku:sku, quote_id:quote_id},
    options);
  }

  removeFromCart(sku:string, quote_id:string){
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest'});
      let options = { headers: headers};
    return this.http.post(environment.api.base_api_url+'/api/cart/product/remove', 
    {sku:sku, quote_id:quote_id},
    options);
  }

  loadUser(){
    var token_ = localStorage.getItem('User_data');
    var bytes  = cryptoJS.AES.decrypt(token_, secret);
    var token = bytes.toString(cryptoJS.enc.Utf8);
    return JSON.parse(token);
  } 

  createCart(){
    if(this.authService.isLoggedIn()){
      let user = this.loadUser();
      let headers = new HttpHeaders({
        'Content-Type': 'application/json'});
      let params = new HttpParams().set("customer_quote", user.id);
      let options = { headers: headers, params: params};
      return this.http.get<any>(environment.api.base_api_url+'/api/cart/product/quote',
      options).do(response => {
        var res = cryptoJS.AES.encrypt(JSON.stringify(response), secret).toString()
        localStorage.setItem('cart_user_id', res)
        // console.log(response);
      });
    }else{
      let headers = new HttpHeaders({
        'Content-Type': 'application/json'});
      let params = new HttpParams().set("guest_quote", "new");
      let options = { headers: headers, params: params};
      return this.http.get<any>(environment.api.base_api_url+'/api/cart/product/quote',
      options).do(response => {
        var res = cryptoJS.AES.encrypt(JSON.stringify(response), secret).toString()
        localStorage.setItem('guest_cart', res)
        // console.log(response);
      });
    }
    // return this.http.get<any>('http://api.motormata.com.ng/api/oo/1');
  }

  public isguest(): boolean{
    return localStorage.getItem('guest_cart') !==  null;
  }
 
  getQuote(){
    if(this.authService.isLoggedIn()){
      var token_ = localStorage.getItem('cart_user_id');
      var bytes  = cryptoJS.AES.decrypt(token_, secret);
      var token = bytes.toString(cryptoJS.enc.Utf8);
      return JSON.parse(token);
    }else{
      var token_ = localStorage.getItem('guest_cart');
      var bytes  = cryptoJS.AES.decrypt(token_, secret);
      var token = bytes.toString(cryptoJS.enc.Utf8);
      return JSON.parse(token);
    }
  }

  getChangeQuote(){
    var token4_ = localStorage.getItem('guest_cart');
    var ss = sessionStorage.setItem('user-guest-cart', token4_)
    var token_ = sessionStorage.getItem('user-guest-cart');
    var bytes  = cryptoJS.AES.decrypt(token_, secret);
    var token = bytes.toString(cryptoJS.enc.Utf8);
    return JSON.parse(token);
  }

  getSess(){
    var token_ = sessionStorage.getItem('user-guest-cart');
    var bytes  = cryptoJS.AES.decrypt(token_, secret);
    var token = bytes.toString(cryptoJS.enc.Utf8);
    return JSON.parse(token);
  }

  changeCartUser(){
    let quote = this.getSess()
    let user = this.loadUser();
    // console.log(quote, user)
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest'});
      let params = new HttpParams().set("user", user.id).set("quote", quote.quote_id);
      let options = { headers: headers, params : params};
    return this.http.get<any>(environment.api.base_api_url+'/api/cart/merge',
     options);
  }
  
  getState(state:string){
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest'});
      let params = new HttpParams().set("state", state);
      let options = { headers: headers, params : params};
    return this.http.get<any>(environment.api.base_api_url+'/api/order/getShipping',
     options);
  }

  
  createShipping(id:string, city:any){
      let headers = new HttpHeaders({
        'Content-Type': 'application/json'});
        let params = new HttpParams().set("quote_id", id).set("city", city);
        let options = { headers: headers, params: params};
        return this.http.get<any>(environment.api.base_api_url+'/api/cart/order/shipping',
        options);
  }
 
  createmethod(){
      let headers = new HttpHeaders({
        'Content-Type': 'application/json'});
        let options = { headers: headers};
      return this.http.get<any>(environment.api.base_api_url+'/api/cart/order/payment',
      options);
  }

  createorder(quote, payment, address, cust_id){
    if(this.authService.isLoggedIn()){
      let headers = new HttpHeaders({
        'Content-Type': 'application/json'});
        let options = { headers: headers};
      return this.http.post(environment.api.base_api_url+'/api/cart/orders/create', 
      {customer_order:address, quote:quote, pay:payment, customer_id:cust_id},
      options);
    }
    if(this.authService.isGuest()){
        let headers = new HttpHeaders({
          'Content-Type': 'application/json'});
          let options = { headers: headers};
        return this.http.post(environment.api.base_api_url+'/api/cart/orders/create', 
        {guest_order:address, quote:quote, pay:payment},
        options);
  }
}
  
  getCartid(){
    var token_ = localStorage.getItem('cart_user_id');
    var bytes  = cryptoJS.AES.decrypt(token_, secret);
    var token = bytes.toString(cryptoJS.enc.Utf8);
    return token;
  }
  
  hasCartid(): boolean{
    return localStorage.getItem('cart_user_id') !==  null;
  }
  getCarts(){
    var token_ = localStorage.getItem('cart')
    var bytes  = cryptoJS.AES.decrypt(token_, secret)
    var token = bytes.toString(cryptoJS.enc.Utf8) 
    // console.log(JSON.parse(token))
    return JSON.parse(token)
  }

  postCarts(){
    localStorage.removeItem('cart')
    localStorage.removeItem('cartid')
    localStorage.removeItem('guest_cart')

    var ciphertext = cryptoJS.AES.encrypt(JSON.stringify(['empty']), secret).toString();
    localStorage.setItem('cartid', ciphertext);
    
    var cart = cryptoJS.AES.encrypt(JSON.stringify(['empty']), secret).toString();
    localStorage.setItem('cart', cart);
  }

}

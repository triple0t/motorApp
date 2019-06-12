import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import { AuthService } from '../auth/auth.service';
import { environment } from '../../../environments/environment';
import {Observable, of} from 'rxjs';
import * as cryptoJS from 'crypto-js';
import { tap } from 'rxjs/internal/operators';
import 'rxjs/Rx';


const headers = new HttpHeaders({
  'Content-Type': 'application/json',
  'X-Requested-With': 'XMLHttpRequest',
  'Access-Control-Allow-Origin':'*',
});
const secret = environment.secret
@Injectable({
  providedIn: 'root'
})
export class CustomerService {
public user;
token;
  constructor(private http: HttpClient, private authService:AuthService) { 
   }
  ngOnInit() {
   this.token = this.authService.getToken();
    if(this.authService.isLoggedIn){
      this.token = this.authService.getToken();
    }
  }
  
  // get User data  
  getUser(){
    this.token = this.authService.getToken();
    let params = new HttpParams().set("token", this.token);
    let options = { headers: headers, params: params };
    return this.http.get(environment.api.base_api_url+'/api/customer/me',
    options).pipe(
      tap((result) => this.saveUser(result)
      ))
  }

  // save User data 
  saveUser(data){
    // console.log(data)
    var ciphertext = cryptoJS.AES.encrypt(JSON.stringify(data), secret).toString();
    localStorage.setItem('User_data', ciphertext);
  }

  // Load User Data
  loadUser(){
    var token_ = localStorage.getItem('User_data');
    var bytes  = cryptoJS.AES.decrypt(token_, secret);
    var token = bytes.toString(cryptoJS.enc.Utf8);
    return JSON.parse(token);
  } 

  // check if User_data is Set
  CheckUserdata():boolean{
    return localStorage.getItem('User_data') !==  null;
  }
   // check if User_data is Set
   CheckUserOrders():boolean{
    return localStorage.getItem('UserOrders_data') !==  null;
  }
  
  getuserOrders(id:string): Observable<any>{
    let params = new HttpParams().set("id", id);
    let options = { headers: headers, params: params };
    return this.http.get<any>(environment.api.base_api_url+'/api/cart/orders',
     options)
  }

  // save UserAddress
  saveUserOrders(data){
    var ciphertext = cryptoJS.AES.encrypt(JSON.stringify(data), secret).toString();
    localStorage.setItem('UserOrders_data', ciphertext);
  }

  // Load User Address
  loadUserOrders(){
    var token_ = localStorage.getItem('UserOrders_data');
    var bytes  = cryptoJS.AES.decrypt(token_, secret);
    var token = bytes.toString(cryptoJS.enc.Utf8);
    return JSON.parse(token);
  } 

  getProduct(sku:string): Observable<any>{
    // let params = new HttpParams().set("sku", sku);
    let options = { headers: headers};
    return this.http.get<any>(environment.api.base_api_url+'/api/product/'+sku,
     options)
  }

  getLatestProducts(){
    let options = { headers: headers};
    return this.http.get(environment.api.base_api_url+'/api/latest/products',
    options)
  }

  getRelatedProducts(id){
    let options = { headers: headers};
    return this.http.get(environment.api.base_api_url+'/api/product/related/'+id,
    options)
  }

  addNewsletter(email:string){
    let params = new HttpParams().set("email", email);
    let options = { headers: headers, params: params };
    return this.http.get(environment.api.base_api_url+'/api/newsletter/add',
    options)
  }

  verify(email:string){
    let params = new HttpParams().set("email", email);
    let options = { headers: headers, params: params };
    return this.http.get(environment.api.base_api_url+'/api/verify/email',
    options)
  }
}
 
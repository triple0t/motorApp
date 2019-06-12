import { Injectable } from '@angular/core';
import { HttpClient,  HttpHeaders, HttpParams} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import { tap } from 'rxjs/internal/operators';
import 'rxjs/Rx';
import * as cryptoJS from 'crypto-js';
import { environment } from '../../../environments/environment';
  
const headers = new HttpHeaders({
  'Content-Type': 'application/json',
  'X-Requested-With': 'XMLHttpRequest'});
const secret = environment.secret;

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient, private authService:AuthService) { }
  token;
  signup(name:string, email:string, password:string){
    let options = { headers: headers };
    return this.http.post(environment.api.base_api_url+'/api/register', 
    {name: name, email: email, password: password}, options)
  }

  signin(email: string, password: string){
    let options = { headers: headers };
    return this.http.post(environment.api.base_api_url+'/api/login', 
    {username: email, password: password}, options).pipe(
      tap((result) => this.setToken(result),
    ))
  }
  
  setToken(response){
    var ciphertext = cryptoJS.AES.encrypt(response.token, secret).toString();
    localStorage.setItem('access_token_secure', ciphertext)
  }

  getToken(){
    var token_ = localStorage.getItem('access_token_secure');
    var bytes  = cryptoJS.AES.decrypt(token_, secret);
    var token = bytes.toString(cryptoJS.enc.Utf8);
    return token;
  }

  isLoggedIn(): boolean{
    return localStorage.getItem('access_token_secure') !==  null;
  }

  logout(){
    localStorage.clear();
  }

  isGuest():boolean{
    return localStorage.getItem('guest_cart') !== null;
  }
  
}

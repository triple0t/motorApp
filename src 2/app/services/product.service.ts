import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs/Observable';
import { map, filter } from 'rxjs/operators';

const headers = new HttpHeaders({
  'Content-Type': 'application/json',
  'X-Requested-With': 'XMLHttpRequest',
  'Access-Control-Allow-Origin':'*',
});
const secret = environment.secret
@Injectable({
  providedIn: 'root'
})
export class ProductService {

  public url = 'assets/data/';
  constructor(private http: HttpClient) { }
    
  getProduct(type:string){

    if(type == 'featured'){
      let options = { headers: headers};
      return this.http.get(environment.api.base_api_url+'/api/products/get/latest',
      options)
    }
    if(type != 'featured'){
      let params = new HttpParams().set("category", type);
      let options = { headers: headers, params:params};
      return this.http.get(environment.api.base_api_url+'/api/products/get/category',
      options)
    }
  }
  public getMainCat(){
    return this.http.get(environment.api.base_api_url+'/api/category/all');
  }
  public getSubCat(id){
    return this.http.get(environment.api.base_api_url+'/api/category/'+id);
  }
  
  public getMeta(id) {
    const options = { headers: headers}
    return this.http.get(environment.api.base_api_url + '/api/category/seo/tags/'+id, options);
  }
}

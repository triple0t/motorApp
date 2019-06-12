import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs/Observable';
import { map, filter } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';

const headers = new HttpHeaders({
  'Content-Type': 'application/json',
  'X-Requested-With': 'XMLHttpRequest',
  'Access-Control-Allow-Origin': '*',
});

const secret = environment.secret;
@Injectable({
  providedIn: 'root'
})
export class YMMService {
  public url = 'assets/data/';
  private YMMSource = new BehaviorSubject({
    year: 'Select a',
    car: 'vehicle'
  });
  currentYMM = this.YMMSource.asObservable();


  constructor(private http: HttpClient) { }
  public getYears(): Observable<any[]> {
    return this.http.get<any[]>(this.url + 'car-years.json').pipe(
      map(items => {
        return items;
      }, error => console.log(error))
    );
  }

  public getMakes(year): Observable<any[]> {
    return this.http.get<any[]>(this.url + 'car-makes.json').pipe(
      map(items => {
        return items.filter(items => items.year_id == year);
      }, error => console.log(error))
    );
  }

  public getModels(year, make): Observable<any[]> {
    return this.http.get<any[]>(this.url + 'car-models.json').pipe(
      map(items => {
        let mak =  make
        return items.filter(items =>items.make == mak);
        // return items.filter(items => items.year_id == year && items.make == mak);
      }, error => console.log(error))
    );
  }

  public getCar(cust) {
    const params = new HttpParams().set('cust_id', cust);
    const options = { headers: headers, params: params};
    return this.http.get(environment.api.base_api_url + '/api/customer/car/get', options);
  }

  public ChangeCar(cust, year, make, model) {
    const params = new HttpParams().set('cust_id', cust).set('make', make).set('model', model).set('year', year);
    const options = { headers: headers, params: params};
    return this.http.get(environment.api.base_api_url + '/api/customer/car/save', options);
  }

  public saveEmail(year){     
    let params = new HttpParams().set("email", year);
    let options = { headers: headers, params:params};      
    return this.http.get(environment.api.base_api_url+'/api/customer/car/email/save', options);
  }
    
  public changeYMM(car: any) {
    this.YMMSource.next(car);
  }
  
  public getMeta(id) {
    const options = { headers: headers}
    return this.http.get(environment.api.base_api_url + '/api/category/seo/tags/'+id, options);
  }

  // public getReview(sku) {
  //   const options = { headers: headers}
  //   return this.http.get(environment.api.base_api_url + '/api/brand/review/'+sku, options);
  // }
  
  public getReview(mak){
    return this.http.get<any[]>(this.url + 'datafile.json').pipe(
      map(items => {
        return items.filter(items =>items.brand == mak);;
      }, error => console.log(error))
    );
  }
}

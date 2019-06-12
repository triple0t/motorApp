import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Data, AppService } from '../../../app.service';
import { AuthService } from '../../../services/auth/auth.service';
import { CustomerService } from '../../../services/customer/customer.service';
import { Customer } from '../../../app.models';

@Component({
  selector: 'app-top-menu',
  templateUrl: './top-menu.component.html',
  styleUrls: ['./top-menu.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TopMenuComponent implements OnInit {
  public currencies = ['USD', 'EUR'];
  public currency:any;
  public flags = [
    { name:'English', image: 'assets/images/flags/gb.svg' },
    { name:'German', image: 'assets/images/flags/de.svg' },
    { name:'French', image: 'assets/images/flags/fr.svg' },
    { name:'Russian', image: 'assets/images/flags/ru.svg' },
    { name:'Turkish', image: 'assets/images/flags/tr.svg' }
  ]
  public flag:any;
  public user: Customer;
  
  public entries: [];
  errorMessage : string;

  isLoggedIn$;
  constructor(public appService:AppService, private authService: AuthService, 
    private customerService:CustomerService, private cd: ChangeDetectorRef) { 
    // this.entries = []; 
    this.isLoggedIn$ = this.isLoggedin();
    if(this.isLoggedIn$){
      // console.log(this.isLoggedIn$, 'yes'); 
    }else{
      // console.log('no');
    }
  }

  ngOnInit() {
    this.currency = this.currencies[0];
    this.flag = this.flags[0];
    this.cd.markForCheck();
  }

  getuser(){
  }

  public changeCurrency(currency){
    this.currency = currency;
  }

  public changeLang(flag){
    this.flag = flag;
  }

  isLoggedin(){
     return this.authService.isLoggedIn();
    // return true;
  }
  onLogout(){
    this.authService.logout(); 
    console.log('loggedout'); 
    location.reload();                    // {3}
  }
  

}

import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth/auth.service';
import { CustomerService } from '../../../services/customer/customer.service';
import { Observable } from 'rxjs'
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  user = <any>[];
  orders = <any>[];
  isLoggedIn$;
  token;
  constructor(private authService: AuthService, private customerService:CustomerService) {
  }

  ngOnInit() {
    this.getData()
  }
  
    isLoggedin(){
      return this.authService.isLoggedIn();
    }

    getData(){
      this.isLoggedIn$ = this.isLoggedin();
      if(this.isLoggedIn$){ 
        if(this.customerService.CheckUserdata()){
          this.user = this.customerService.loadUser()
        }else{
          this.customerService.getUser()
          .subscribe(response => {
            this.user = response
          }, 
          error => console.log(error));        
        }
        // get Order rev
        if(this.customerService.CheckUserOrders()){
          this.orders = this.customerService.loadUserOrders()
        }else{
          this.customerService.getuserOrders(this.user.email)
          .subscribe(response => {
            this.orders = response
          }, 
          error => console.log(error));        
        }

      }
    }

    getAddress(){
      return this.user['addresses']
    }
}

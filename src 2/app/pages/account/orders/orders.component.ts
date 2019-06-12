import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';
import { CustomerService } from 'src/app/services/customer/customer.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit {

  orders;
  token;
  user =<any>[];
  constructor(public authService:AuthService, public customerService:CustomerService) { }

  ngOnInit() {
    this.getData()
  }

  getData(){ 
      if(this.customerService.CheckUserdata()){
        this.user = this.customerService.loadUser()
      }else{
        this.customerService.getUser()
        .subscribe(response => {
          this.user = response
          console.log(this.user)
        }, 
        error => console.log(error));        
      }
      
        this.customerService.getuserOrders(this.user.id)
        .subscribe(response => {
          this.orders = response
          console.log(response)
        }, 
        error => console.log(error)
        ); 
  }

}

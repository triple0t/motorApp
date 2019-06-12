import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';
import { AppService } from 'src/app/app.service';

@Component({
  selector: 'app-mid-menu',
  templateUrl: './mid-menu.component.html',
  styleUrls: ['./mid-menu.component.css']
})
export class MidMenuComponent implements OnInit {

  constructor(public authService:AuthService, public appService:AppService) { }

  ngOnInit() {
    this.appService.getCart()
  }

  isLoggedIn(){
    if(this.authService.isLoggedIn() == true){  
      return true;
    }else{
      return false;
    }
  }

}

import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Settings, AppSettings } from './app.settings';
import { AuthService } from './services/auth/auth.service';
import { NgAisModule } from 'angular-instantsearch'; 

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  // show: boolean = true;
  loading: boolean = false;
  public settings: Settings;
  // public isLoggedIn$: boolean;
  constructor(public appSettings:AppSettings, public router: Router, private authService: AuthService){
    this.settings = this.appSettings.settings; 
  }

  ngOnInit() {
   // this.router.navigate(['']);  //redirect other pages to homepage on browser refresh  
  //  this.isLoggedIn$ = false; 
  //  this.isLoggedIn$ = this.isLoggedin(); 
  //  console.log(this.isLoggedIn$);
  }

  ngAfterViewInit(){
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
          window.scrollTo(0,0);
      }
    })  
  }
  isLoggedin(){
    return this.authService.isLoggedIn(); 
  }
  onLogout(){
    this.authService.logout();                      // {3}
  }
}

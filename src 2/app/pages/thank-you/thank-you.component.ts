import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-thank-you',
  templateUrl: './thank-you.component.html',
  styleUrls: ['./thank-you.component.scss']
})
export class ThankYouComponent implements OnInit {
  email;
  image;
  test;
  constructor(public router:Router, private activatedRoute: ActivatedRoute, ) {
      if(this.router.getCurrentNavigation().extras.state != null){
        const navigation = this.router.getCurrentNavigation();
        const state = navigation.extras.state as {
          email: string,
        }; 
        this.email =  state.email
        this.image = 'assets/images/thank-you.png';
      }else{
        this.router.navigateByUrl('/');
      }
  }

  ngOnInit() {
  }

}

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { CustomerService } from '../../../services/customer/customer.service';
import { emailValidator} from '../../../theme/utils/app-validators';
import { NgxSpinnerService } from 'ngx-spinner';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  public lat: number = 40.678178;
  public lng: number = -73.944158;
  public zoom: number = 12;
  
  subscribeForm: FormGroup;
  email;
  constructor(public router:Router, private activatedRoute: ActivatedRoute, public formBuilder: FormBuilder,  public snackBar: MatSnackBar, private spinner: NgxSpinnerService, private customerService:CustomerService) { }

  ngOnInit() { 
    this.subscribeForm = this.formBuilder.group({
      'email': ['', Validators.compose([Validators.required, emailValidator])]
    });
  }

  subscribe(value){
    this.spinner.show();
    this.email = value.email;
    if (this.subscribeForm.valid) {
      this.customerService.addNewsletter(value.email)
      .subscribe(
        response => {
          console.log(response, value.email);
        var message = 'successfully subscribed '+ value.email;
        var status = 'success'; 
        this.snackBar.open(message, '×', { panelClass: [status], verticalPosition: 'top', duration: 3000 });
        this.spinner.hide();
        this.router.navigate(["/thank-you"],{ state: { email:value.email }} );
      },
      error => {
        console.log(error);
        this.spinner.hide();
        var message = 'an eror occurred'; 
        var status = 'error'; 
        this.snackBar.open(message, '×', { panelClass: [status], verticalPosition: 'top', duration: 3000 });
        // location.reload();
      });
    }else{ 
      var message = 'invalid email';
      var status = 'error'; 
      this.snackBar.open(message, '×', { panelClass: [status], verticalPosition: 'top', duration: 3000 });
      this.spinner.hide();
    }

   }

}
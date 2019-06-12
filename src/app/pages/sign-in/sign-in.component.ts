import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { emailValidator, matchingPasswords, UpperValidator } from '../../theme/utils/app-validators';
import { AuthService } from '../../services/auth/auth.service';
import { CustomerService } from '../../services/customer/customer.service';
import { Observable } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';


@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent implements OnInit {
  loginForm: FormGroup;
  registerForm: FormGroup;
  loading = false;
  returnUrl: string;
  isLoggedIn$:boolean;


  constructor(public formBuilder: FormBuilder, public router:Router, private spinner: NgxSpinnerService,
    private route: ActivatedRoute, public snackBar: MatSnackBar, private AuthService: AuthService, 
    private customerService:CustomerService) {
      this.isLoggedIn$ = this.isLoggedin();
      if(this.isLoggedIn$){
        console.log('already logged in');
        this.router.navigate(["/account/dashboard"]);
      }
     }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      'email': ['', Validators.compose([Validators.required, emailValidator])],
      'password': ['', Validators.compose([Validators.required, Validators.minLength(6)])] 
    });

    this.registerForm = this.formBuilder.group({
      'name': ['', Validators.compose([Validators.required, Validators.minLength(3)])],
      'email': ['', Validators.compose([Validators.required, emailValidator])],
      'password': ['', Validators.compose([Validators.required, Validators.minLength(6), UpperValidator])],
      'confirmPassword': ['', Validators.required]
    },{validator: matchingPasswords('password', 'confirmPassword')});
        // get return url from route parameters or default to '/'
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  public onLoginFormSubmit(values:Object):void { 
    this.spinner.show();
    if (this.loginForm.valid) {
      // this.router.navigate(['/']);
      localStorage.clear();
      this.AuthService.signin(this.loginForm.value.email, this.loginForm.value.password)
      .subscribe(
        response => {
          console.log(response);
          // this.AuthService.setToken(res['token']);
          this.router.navigateByUrl('/account');
          this.spinner.hide();
          var message = 'Logged in Successfully.';
          var status = 'success'; 
          this.snackBar.open(message, '×', { panelClass: [status], verticalPosition: 'top', duration: 3000 });
          // location.reload();
        },
        error => {
          console.log(error);
          this.spinner.hide();
          var message = 'invalid Credientials'; 
          var status = 'error'; 
          this.snackBar.open(message, '×', { panelClass: [status], verticalPosition: 'top', duration: 3000 });
          // location.reload();
        }
      );
    }
  }

  public onRegisterFormSubmit(values:Object):void {
    this.loading  = true;
    if (this.registerForm.valid) {
      // this.snackBar.open('You registered successfully!', '×', { panelClass: 'success', verticalPosition: 'top', duration: 3000 });
      this.AuthService.signup(this.registerForm.value.name, this.registerForm.value.email, this.registerForm.value.password)
      .subscribe(
        response => {
          console.log(response);
          var message = "Registered Successfully";
          var status = "success";
          this.snackBar.open(message, '×', { panelClass: [status], verticalPosition: 'top', duration: 3000 });
          this.router.navigate(["/sign-in"]);
        },
        error => {
          console.log(error, error.error.message);  
          var message;
          if(error.error.message !== "A customer with the same email already exists in an associated website."){
            message = error.error.message;
          }else{
            message = "Email already Registered"; 
          } 
          var status = 'error'; 
          this.snackBar.open(message, '×', { panelClass: [status], verticalPosition: 'top', duration: 3000 });
        }
      );
    }
  }

  isLoggedin(){
    return this.AuthService.isLoggedIn(); 
  }
}

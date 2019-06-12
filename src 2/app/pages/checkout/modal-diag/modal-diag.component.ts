import { Component,  ViewEncapsulation, OnInit, Inject, Input} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { AppService } from '../../../app.service';
import { Router, ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { MatSnackBar } from '@angular/material';
import { emailValidator, matchingPasswords, UpperValidator } from '../../../theme/utils/app-validators';
import { AuthService } from '../../../services/auth/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomerService } from 'src/app/services/customer/customer.service';

@Component({
  selector: 'app-modal-diag',
  templateUrl: './modal-diag.component.html',
  styleUrls: ['./modal-diag.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ModalDiagComponent implements OnInit {
  loginForm: FormGroup;
  registerForm: FormGroup;
  loading = false;
  returnUrl: string;
  isLoggedIn$: boolean;
  showLogin = false;
  showReg = false;

  constructor(
    public appService: AppService,
    public formBuilder: FormBuilder,
    public router: Router,
    private spinner: NgxSpinnerService,
    public customerService: CustomerService,
    private route: ActivatedRoute,
    public snackBar: MatSnackBar,
    private authService: AuthService,
    public dialogRef: MatDialogRef<ModalDiagComponent>,
    @Inject(MAT_DIALOG_DATA)@Input() public data
  ) { }
  ngOnInit() {
    console.log('dialog data', this.data);
    this.spinner.show();
    this.verify();
    this.loginForm = this.formBuilder.group({
      // Bolanle
      'email': [this.data.email, Validators.compose([Validators.required, emailValidator])],
      'password': ['', Validators.compose([Validators.required, Validators.minLength(6)])]
    });
    this.registerForm = this.formBuilder.group({
      'name': ['', Validators.compose([Validators.required, Validators.minLength(3)])],
      // Bolanle
      'email': [this.data.email, Validators.compose([Validators.required, emailValidator])],
      'password': ['', Validators.compose([Validators.required, Validators.minLength(6), UpperValidator])],
      'confirmPassword': ['', Validators.required]
    }, {validator: matchingPasswords('password', 'confirmPassword')});
  }

  public async onLoginFormSubmit(values: Object) {
    this.spinner.show();
    localStorage.clear();
    if (this.loginForm.valid) {
      this.authService.signin( this.data.email, this.loginForm.value.password)
      .subscribe(
        response => {
          console.log(response);
          this.customerService.getUser().subscribe(
            response => {
              console.log(response);
              this.spinner.hide();
              this.appService.getCart();
              const message = 'Logged in Successfully.';
              const status = 'Success';
              this.snackBar.open(message, '×', { panelClass: [status], verticalPosition: 'top', duration: 3000 });
              this.dialogRef.close();
            }
          );
        },
        error => {
          console.log(error);
          this.spinner.hide();
          const message = 'invalid Credientials';
          const status = 'error';
          this.snackBar.open(message, '×', { panelClass: [status], verticalPosition: 'top', duration: 3000 });
          // location.reload();
        }
      );
    }
  }

  public onRegisterFormSubmit(values: Object): void {
    // if (this.data && this.data.value) {
    //   this.registerForm.value.email = this.data.value;
    // }
    console.log(this.registerForm.value);
    console.log('form valid?', this.registerForm.valid);
    if (this.registerForm.valid) {
      // this.snackBar.open('You registered successfully!', '×', { panelClass: 'success', verticalPosition: 'top', duration: 3000 });
      // Bolanle
      this.authService.signup(this.registerForm.value.name, this.registerForm.value.email , this.registerForm.value.password)
      .subscribe(
        response => {
          this.customerService.getUser().subscribe(
            response => {
              console.log(response);
              this.spinner.hide();
              this.appService.getCart();
              const message = 'Registered Successfully';
              const status = 'success';
              this.snackBar.open(message, '×', { panelClass: [status], verticalPosition: 'top', duration: 3000 });
              this.dialogRef.close();
            });
        },
        error => {
          console.log(error, error.error.message);
          let message;
          if (error.error.message !== 'A customer with the same email already exists in an associated website.') {
            message = error.error.message;
          } else {
            message = 'Email already Registered';
          }
          const status = 'error';
          this.snackBar.open(message, '×', { panelClass: [status], verticalPosition: 'top', duration: 3000 });
        }
      );
    }
  }

  public close(): void {
    this.dialogRef.close();
  }

  public verify() {
    this.customerService.verify(this.data.email).subscribe(
      response => {
        console.log(response);
        if (response === '0' || response === 0) {
          console.log('register');
          this.spinner.hide();
          this.showReg = true;
          this.loading = false;
        }
        if (response === '1' || response === 1) {
          console.log('login');
          this.spinner.hide();
          this.showLogin = true;
          this.loading = false;
        }
      },
      error => console.log(error)
    );
  }

}

import { Component, OnInit, ViewChild, ChangeDetectionStrategy, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { MatStepper } from '@angular/material';
import { Data, AppService } from '../../app.service';
import { CartService } from '../../services/cart/cart.service';
import { CustomerService } from '../../services/customer/customer.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { environment } from '../../../environments/environment';
import { ModalDiagComponent } from './modal-diag/modal-diag.component';
import { connectableObservableDescriptor } from 'rxjs/internal/observable/ConnectableObservable';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss'],
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class CheckoutComponent implements OnInit {
  @ViewChild('horizontalStepper') horizontalStepper: MatStepper;
  @ViewChild('verticalStepper') verticalStepper: MatStepper;
  @Input('email')
  billingForm: FormGroup;
  billingForm2: FormGroup;
  billingAddress;
  Totalgrand;
  bank;
  logged=<boolean>null;
  states;
  token;
  deliveryForm: FormGroup;
  paymentForm: FormGroup;
  countries = [];
  months = [];
  years = [];
  deliveryMethods = [];
  grandTotal = 0;
  loading=<boolean>true
  showForm =<boolean>true
  Mamount
  s_method
  pay_method
  base_url_mage = environment.api.base_url_mage;
  cartitems;
  address;
  add2;
  p_method;
  email;
  bill;
  cartid;
  today;
  ref;
  refAmount;
  subTotal;
  discount=0;
  pay;
  paystack_key = environment.paystack_key;
  totalCartNo:number = 0;

  constructor( public appService:AppService, public dialog: MatDialog, public customerService:CustomerService, 
  public formBuilder: FormBuilder, public authService:AuthService, public cartService:CartService) { 
      this.appService.getCart()
      this.cartid = this.cartService.getQuote();
      this.today = new Date();
      var dd = String(this.today.getDate()).padStart(2, '0');
      var mm = String(this.today.getMonth() + 1).padStart(2, '0'); //January is 0!
      var yyyy = this.today.getFullYear();
      var h = this.today.getHours();
      var m = this.today.getMinutes();
      var s = this.today.getSeconds();  
      this.today = mm + '-' + dd + '-' + yyyy+'--'+h+'-'+m+'--'+s;
      this.ref = this.cartService.getQuote().quote_id+'-'+this.today; 
  }
   
  onNoClick(): void {
  }

  ngOnInit() {    
    if(this.authService.isLoggedIn()){
      this.onstart()
      this.logged = true;
      this.showForm = false;
      // this.getAddress();
      // console.log(this.showForm)
    }else{
      if(this.authService.isGuest()){
        this.logged = false;
        // this.getbillingAddress()
        this.start2();
      }
    }
    this.getCarttotal()
    
  }

  onstart(){
    if(this.showForm){
      this.start();
      // console.log(this.showForm)
    }else{
      this.start2();
    }
  }

  public start(){
    this.countries = this.appService.getCountries();
    this.states = this.appService.getStates();
    this.months = this.appService.getMonths();
    this.years = this.appService.getYears();
    this.deliveryMethods = this.appService.getDeliveryMethods();
    this.billingForm2 = this.formBuilder.group({
        billingMethod: [this.billingAddress, Validators.required]
    });
    this.billingForm = this.formBuilder.group({
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        middleName: '',
        company: '',
        email: ['', Validators.required],
        phone: ['', Validators.required],
        country: ['', Validators.required],
        city: ['', Validators.required],
        state:['', Validators.required], 
        zip: '',
        address: ['', Validators.required]
    });
    this.deliveryForm = this.formBuilder.group({
      deliveryMethod: [this.deliveryMethods[0], Validators.required]
    });
    this.paymentForm = this.formBuilder.group({
      cardHolderName: [''],
      cardNumber: [''],
      expiredMonth: [''],
      expiredYear: [''],
      cvv: [''],
      paymentMethod: [this.pay_method, Validators.required],
    });
  }
  paymentCancel(){
  }

  PaymentComplete(ref) {
    console.log(ref)
    this.loading = false;
    this.pay = true;
  }

  async startL(){
    this.loading = true;
    this.pay = false;
    this.createOrderpay();
  }
  public start2(){
    this.countries = this.appService.getCountries();
    this.states = this.appService.getStates();
    this.months = this.appService.getMonths();
    this.years = this.appService.getYears();
    this.deliveryMethods = this.appService.getDeliveryMethods();
      this.billingForm = this.formBuilder.group({
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        middleName: '',
        company: '',
        email: ['', Validators.required],
        phone: ['', Validators.required],
        country: ['', Validators.required],
        city: ['', Validators.required],
        state: ['', Validators.required],
        zip: '',
        address: ['', Validators.required]
      });
    this.deliveryForm = this.formBuilder.group({
      deliveryMethod: [this.deliveryMethods[0], Validators.required]
    });
    this.paymentForm = this.formBuilder.group({
      cardHolderName: [''],
      cardNumber: [''],
      expiredMonth: [''],
      expiredYear: [''],
      cvv: [''],
      paymentMethod: [this.pay_method, Validators.required],
    });

  }

  public async placeOrder(){
    this.horizontalStepper._steps.forEach(step => step.editable = false);
    this.verticalStepper._steps.forEach(step => step.editable = false);
    this.appService.Data.cartList.length = 0;    
    this.appService.Data.totalPrice = 0;
    this.appService.Data.totalCartCount = 0;
  }
  
  public onBllSubmit(values:Object):void{

    if (this.billingForm.valid) {
        this.loading = false;
        this.bill = this.billingForm.value;
        let region_id = '586';
        this.address = {
          "region": this.bill.state,
          "region_id": region_id,
          "region_code": "LOS",
          "country_id": this.bill.country.code,
          "street": [
            this.bill.address
            ],
          "postcode": this.bill.zip,
          "city": this.bill.city,
          "firstname": this.bill.firstName,
          "lastname": this.bill.lastName,
          "email": this.bill.email,
          "telephone": this.bill.phone,
          "same_as_billing": 1
        };
        this.add2 = {
          "email": this.bill.email,
          "region":this.bill.state,
          "region_id": region_id,
          "region_code": "LOS",
          "country_id": this.bill.country.code,
          "street": [
            this.bill.address
          ],
          "postcode":this. bill.zip,
          "city": this.bill.city,
          "telephone": this.bill.phone,
          "firstname": this.bill.firstName,
          "lastname": this.bill.lastName      
        }

      if(this.authService.isLoggedIn()){
        this.getdevll()
      }
      if(this.authService.isGuest()){
        this.openModal(this.address.email)
      }
    }
  }
  
  public async getdevll(){
    await this.appService.getCart()
    let quote = await this.cartService.getQuote();
      await this.cartService.createShipping(quote.quote_id, this.address.region).subscribe(
        response2=> {
          this.loading = true;
          this.Mamount = response2;
          this.s_method = [
            {method_title: 'MotorMata_Shipping', carrier_title:'Shipping/Delivery Fee', amount:this.Mamount}
          ];
          console.log(this.s_method)
          console.log(this.address, quote);
        },
        error2 => {
          console.log(error2)
        }
      );
  }

  public onBllSubmit2(values:Object):void{
    if (this.billingForm2.valid) {
      this.loading = false;
      this.bill = this.billingForm2.value.billingMethod;
    //   let region_id = '586';
      this.address = {
        "region": this.bill.region.region,
        "region_id": this.bill.region.region_id,
        "region_code": this.bill.region.region_code,
        "country_id": this.bill.country_id,
        "street": [
          this.bill.street
          ],
        "postcode": this.bill.postcode,
        "city": this.bill.city,
        "firstname": this.bill.firstname,
        "lastname": this.bill.lastname,
        "email": this.email,
        "telephone": this.bill.telephone,
        "same_as_billing": 1
      };
      this.add2 = {
        "email": this.email,
        "region":this.bill.region.region,
        "region_id": this.bill.region.region_id,
        "region_code": this.bill.region.region_code,
        "country_id": this.bill.country_id,
        "street": [
          this.bill.street
        ],
        "postcode": this.bill.postcode,
        "city": this.bill.city,
        "telephone": this.bill.telephone,
        "firstname": this.bill.firstname,
        "lastname": this.bill.lastname     
      }
      console.log(this.address, this.add2)
        if(this.authService.isLoggedIn()){

          let quote = this.cartService.getQuote();
            this.cartService.createShipping(quote.quote_id, this.address.region).subscribe(
              response2=> {
                this.loading = true;
                this.Mamount = response2;
                this.s_method = [
                  {method_title: 'MotorMata_Shipping', carrier_title:'Shipping/Delivery Fee', amount:this.Mamount}
                ];
                console.log(this.s_method)
                console.log(this.address, quote);
              },
              error2 => {
                console.log(error2)
              }
            );
        }
    }
  }

  public BshowForm(value){
    this.showForm = value;
    this.onstart();
    // console.log(this.showForm)
  }

  public onDevSubmit(values:Object):void{
    this.pay_method = [];
    if(this.deliveryForm.valid){
      let method = this.deliveryForm.controls.deliveryMethod.value.method_code
      // this.loading = false;
        this.cartService.createmethod().subscribe(
          response=> {
            this.loading = true;
            this.pay_method = response
          },
          error => {console.log(error)})
    }
  }

  public onPaySub(values:Object):void{
    if(this.paymentForm.valid){
      this.p_method = this.paymentForm.controls.paymentMethod.value.code
      this.getCarttotal()
      this.refAmount = this.grandTotal+'00';
      console.log(this.refAmount, this.ref);
    }  
  }

  public async createOrder(){
    if(this.paymentForm.valid){
      this.placeOrder()
      this.loading = false;
      if(this.authService.isLoggedIn()){
        let cart_id = this.cartService.getQuote();
        let cust_id = this.customerService.loadUser()
        let cart = {
          'base_subtotal':this.grandTotal,
          'shipping_amount':this.Mamount,
          'customer_email':this.add2.email,
          'customer_firstname':this.add2.firstname,
          'customer_lastname':this.add2.lastname,
          'customer_middlename':this.add2.middlename,
          'address': this.add2
          } 
        
        // console.log(cart_id.quote_id, this.p_method, this.add2,cust_id);
        this.cartService.createorder(cart_id.quote_id, this.p_method, cart, cust_id.id).subscribe(
          response=> {
            console.log(response)
            this.loading = true;
            this.bank = true;
            this.appService.getCart()
          },
          error => {console.log(error)})

      }
      if(this.authService.isGuest()){
        let cart_id = this.cartService.getQuote();
        let cart = {
          'base_subtotal':this.grandTotal,
          'shipping_amount':this.Mamount,
          'customer_email':this.add2.email,
          'customer_firstname':this.add2.firstname,
          'customer_lastname':this.add2.lastname,
          'customer_middlename':this.add2.middlename,
          'address': this.add2
          } 
        this.cartService.createorder(cart_id.quote_id, this.p_method, cart, this.add2.email).subscribe(
          response=> {
            console.log(response)
            this.loading = true;
            this.bank = true;
            this.appService.getCart()
          },
          error => {console.log(error)}
          )
      }
    }
  }
  public async createOrderpay(){
    if(this.paymentForm.valid){
      this.placeOrder()
      this.loading = false;
      if(this.authService.isLoggedIn()){
        let cart_id = this.cartService.getQuote();
        let cust_id = this.customerService.loadUser()
        let cart = {
          'base_subtotal':this.grandTotal,
          'shipping_amount':this.Mamount,
          'customer_email':this.add2.email,
          'customer_firstname':this.add2.firstname,
          'customer_lastname':this.add2.lastname,
          'customer_middlename':this.add2.middlename,
          'address': this.add2
          } 
        
        // console.log(cart_id.quote_id, this.p_method, this.add2,cust_id);
        this.cartService.createorder(cart_id.quote_id, this.p_method, cart, cust_id.id).subscribe(
          response=> {
            console.log(response)
            this.appService.getCart()
          },
          error => {console.log(error)})

      }
      if(this.authService.isGuest()){
        let cart_id = this.cartService.getQuote();
        let cart = {
          'base_subtotal':this.grandTotal,
          'shipping_amount':this.Mamount,
          'customer_email':this.add2.email,
          'customer_firstname':this.add2.firstname,
          'customer_lastname':this.add2.lastname,
          'customer_middlename':this.add2.middlename,
          'address': this.add2
          } 
        this.cartService.createorder(cart_id.quote_id, this.p_method, cart, this.add2.email).subscribe(
          response=> {
            console.log(response)
            this.appService.getCart()
          },
          error => {console.log(error)}
          )
      }
    }
  }

  public getbillingAddress(){
    if(this.authService.isLoggedIn){ 
      this.token = this.authService.getToken();
      this.customerService.getUser().subscribe(
        response => {
         this.billingAddress = response['addresses']
         console.log(this.billingAddress)
      },
      error =>{ 
        console.log(error)
      });
    }else{
      console.log('noo way')
    }

  }

  public getAddress(){
    // let token = this.authService.getToken();
    this.customerService.getUser().subscribe(
      response => {
        console.log(response),
        this.loading = false;
        this.email = response['email'];
        this.billingAddress = response['addresses'];
        if(this.billingAddress.length <= 0){
          this.showForm = true;
          // this.start2();
        }
      },
      error => {console.log(error)
      }
    )
  }

  public useAddress(value:object):void{
    console.log('you selected'+ this.billingForm2.value)
  }

  public async getCarttotal(){
    this.subTotal = 0;
    this.grandTotal = 0;

    this.appService.cartitems.forEach(product=>{
      let total = product.qty*product.price
      this.subTotal += total;
    })
    this.grandTotal = (this.subTotal - (this.subTotal*this.discount)) + this.Mamount;
  }
  
  onLogin(value){
    console.log(value)
  }
  
  public async openModal(value){
      this.cartService.getChangeQuote()
    console.log(value)
    let dialogRef = this.dialog.open(ModalDiagComponent, {
        data:{email:value}  
    });
    dialogRef.afterClosed().subscribe(response => {
      this.cartService.changeCartUser().subscribe(
        response=>{
          if(response == true){
            this.onBllSubmit(this.billingForm.value);
            console.log('woow', response);
          }
        }
      )
    })
  }
}

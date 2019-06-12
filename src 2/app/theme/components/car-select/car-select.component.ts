import { Component, OnInit, HostListener, ElementRef  } from '@angular/core';
import { Select2OptionData } from 'ng2-select2';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { environment } from '../../../../environments/environment';
import { Router, ActivatedRoute } from '@angular/router';
import { YMMService } from '../../../services/YMM.service';
import * as cryptoJS from 'crypto-js';
import { AuthService } from '../../../services/auth/auth.service';
import { CustomerService } from '../../../services/customer/customer.service';
import { Subject } from 'rxjs';

const secret = environment.secret;
const optionsa = environment.algolia;
@Component({
  selector: 'app-car-select',
  templateUrl: './car-select.component.html',
  styleUrls: ['./car-select.component.scss']
})

export class CarSelectComponent implements OnInit {
  makeCon: boolean;
  modelSelect: boolean;
  makeSelect: boolean;
  CarFormBtn: boolean;
  CarForm: FormGroup;
  showCarForm: boolean;
  year;
  make;
  model;
  sub_model='ALL';
  CarMake;
  return;
  carSelect: boolean;
  public yearData: Array<any>;
  public makeData: Array<any>;
  public modelData: Array<any>;
  private _onDestroy = new Subject<void>();
  openVehicleNav = false;

  // YoptionsSelect = {
  //   disabled: false,
  //   width: "100%"
  // }

  constructor(
    private eRef: ElementRef,
    public formBuilder: FormBuilder,
    public router: Router,
    private route: ActivatedRoute,
    public authService: AuthService,
    public customerService: CustomerService,
    public YMMService: YMMService) {  this.return =
      this.route.snapshot.queryParams['returnUrl'] || '/'; }

  ngOnInit() {
    this.showCarForm = true;
    this.getAuthSelectCar();
    this.CarForm = this.formBuilder.group({
      'year': ['', Validators.compose([Validators.required])],
      'make': ['', Validators.compose([Validators.required])],
      'model': ['', Validators.compose([Validators.required])]
    });
    this.getYearLst();
    // let options: Select2Options;
  }

  getYearLst(){
    this.YMMService.getYears().subscribe(
      response=>{
        // console.log('response', typeof response),
        this.yearData = response['0'].children; // changed the value of the yearData array
        // console.log('Year data', this.yearData);
      },
      error => console.log(error)
    );
  }

  getMakeList(year){
    console.log('year', year);
    this.YMMService.getMakes(year).subscribe(
      response => {
        console.log('response', response);
        this.makeData = response;
      }, 
      error=>console.log(error)
    ); 
  }

  // getMakeList(){
  //   this.YMMService.getMakes(2018).subscribe(
  //     response=>{
  //       console.log('response', response),
  //       this.makeData = response;
  //     }, 
  //     error=>console.log(error)
  //   ); 
  // }

  getModelList(year, model){
    this.YMMService.getModels(year, model).subscribe(
      response=>{
        console.log(response)
        if(!response[0]){
          this.modelData = [{"id": "ALL", "text":"ALL" }];
        }else{
          this.modelData = response;
        }
      }, 
      error=>console.log(error)
    ); 
  }
  // onYearChange($event){
  //     console.log('event', $event);

  //   if($event.value !== 'year'){
  //     this.year = $event.value; // change the value of the year to the value from the data emitted from select event
  //     this.makeSelect = true;
  //     this.getMakeList();
  //     // console.log($event.value)
  //   }else{
  //     this.makeSelect =false;
  //     // console.log($event, 'woow!')
  //   }
  // }
  onYearChange($event){
    console.log($event)
    if($event.value != "year"){
      this.year = $event.value;
      this.makeSelect =true;
      this.getMakeList(this.year);
      // console.log($event.value)
    } else {
      this.makeSelect = false;
      // console.log($event, 'woow!')
    }
  }

  onMakeChange($event){
    if($event.value != "make"){
      console.log($event)
      this.make = $event.value;
      this.modelSelect =true;
      this.getModelList(this.year, this.make);
    }else{
      this.modelSelect =false;
      console.log($event, 'woow!')
    }
  }

  // onModelChange($event){
  //   if($event.value !== 'model'){
  //     this.model = $event.value;
  //     this.CarFormBtn =true;
  //     // this.getMakeList();
  //     // console.log($event.value)
  //   }else{
  //     this.CarFormBtn =false;
  //     // console.log($event, 'woow!')
  //   }
  // }

  onModelChange($event){
    if($event.value != "model"){
      this.model = $event.value;
      this.CarFormBtn =true;
      // this.getMakeList();
      console.log($event.value)
    }else{
      this.CarFormBtn =false;
      // console.log($event, 'woow!')
    }
  }
  
  onCarFormSubmit(){
    if(this.make=="" || this.model=="" || this.year==""){
      // console.log('error occured 111')
    }else{
      this.setCar();
      if(this.authService.isLoggedIn()){
        let cust = this.customerService.loadUser()
        this.YMMService.ChangeCar(cust.id, this.year, this.make, this.model).subscribe(
          response=>{
            if(response == true){
              this.getAuthSelectCar()
              // this.router.navigateByUrl(this.router.url); 
              location.reload();
            }
          })
      } else { 
        const CarYMM = this.make+'-'+this.model+'-ALL-'+this.year;
        const car = cryptoJS.AES.encrypt(JSON.stringify(CarYMM), secret).toString();
        localStorage.setItem('CarYMM', car);
        this.getSelectedCar();
        location.reload();
      }
    }
  }

  onClickedOutside(e: Event) {
    if (this.eRef.nativeElement.contains(e.target)) {
    } else {
      // this.triggered =false
      if (this.openVehicleNav === true) {
        this.openVehicleNav = false;
        // console.log('non')
        // console.log('clicked lllltside');
      }
    }
  }

  carSelected(){
    if(localStorage.getItem('CarYMM')){
      this.getSelectedCar();
      this.carSelect = true;
      this.showCarForm = false;
    } else {
     this.showCarForm = true;
    }
  }

  getSelectedCar() {
      const token = localStorage.getItem('CarYMM');
      const bytes  = cryptoJS.AES.decrypt(token, secret);
      this.CarMake  = JSON.parse(bytes.toString(cryptoJS.enc.Utf8));
      this.showCarForm = false;
  }

  getCar() {
      const token = localStorage.getItem('CarYMM');
      const bytes  = cryptoJS.AES.decrypt(token, secret);
      const CarMake  = JSON.parse(bytes.toString(cryptoJS.enc.Utf8));
      return CarMake;
  }

  getAuthSelectCar(){
    if(this.authService.isLoggedIn()){
      let cust = this.customerService.loadUser()
      this.YMMService.getCar(cust.id).subscribe(
        response=>{
          let CarYMM = response['make']+'-'+response['model']+'-ALL-'+response['year'];
          var car = cryptoJS.AES.encrypt(JSON.stringify(CarYMM), secret).toString();
          localStorage.setItem('CarYMM', car);
        });
    }
    this.carSelected();
  }

  changeCar() {
    // console.log('change car')
    this.showCarForm = true;
    this.carSelect = true;
  }

  ShowCar(){
    // console.log('show car')
    this.showCarForm = false;
    this.carSelect = true;
  }

  clearCar(){
    // console.log('clear car')
    this.YMMService.changeYMM({
      year: 'Select a',
      car: 'vehicle'
    });
    
    localStorage.removeItem('CarYMM');
    localStorage.removeItem('YMM');


    this.showCarForm = true;
    this.carSelect = false;
    // this.router.navigateByUrl(this.router.url);
    location.reload();
  }

  setCar () {
    const carObj = {
      year: this.year,
      car: `${this.make} ${this.model}`
    };
    this.YMMService.changeYMM(carObj);
    localStorage.setItem('YMM', JSON.stringify(carObj));
  }



}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { CheckoutComponent } from './checkout.component';
// import { Angular4PaystackModule } from '../../angular4-paystack/angular4-paystack.module';
import { Angular4PaystackModule } from 'angular4-paystack';
import { ModalDiagComponent } from './modal-diag/modal-diag.component';

export const routes = [
  { path: '', component: CheckoutComponent, pathMatch: 'full' }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    SharedModule,
    Angular4PaystackModule,
  ],
  declarations: [
    CheckoutComponent,
    ModalDiagComponent
  ],
  entryComponents:[
    ModalDiagComponent
  ],
})
export class CheckoutModule { }

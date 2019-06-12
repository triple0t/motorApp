import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { ThankYouComponent } from './thank-you.component';

export const routes = [
  { path: '', component: ThankYouComponent, pathMatch: 'full' }
];

@NgModule({
  declarations: [
    ThankYouComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    SharedModule
  ]
})
export class ThankYouModule { }

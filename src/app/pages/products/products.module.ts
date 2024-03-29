import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SwiperModule } from 'ngx-swiper-wrapper';
import { NgxPaginationModule } from 'ngx-pagination';
import { SharedModule } from '../../shared/shared.module';
import { PipesModule } from '../../theme/pipes/pipes.module';
import { ProductsComponent } from './products.component';
import { NgAisModule } from 'angular-instantsearch';
import { ActivatedRoute } from '@angular/router';

export const routes = [
  { path: '', component: ProductsComponent, pathMatch: 'full' },
  { path: ':name', component: ProductsComponent },
  // { path: ':id/:name', component: ProductComponent }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule,
    SwiperModule,
    NgxPaginationModule,
    SharedModule,
    PipesModule,
    NgAisModule
  ],
  declarations: [
    ProductsComponent,
  ],
})
export class ProductsModule { }

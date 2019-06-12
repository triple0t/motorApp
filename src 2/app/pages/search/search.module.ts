import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { SwiperModule } from 'ngx-swiper-wrapper';
import { SharedModule } from '../../shared/shared.module';
import { SearchComponent } from './search.component';
import { DemoComponent } from '../demo/demo.component';
import { NgAisModule } from 'angular-instantsearch';
import { PipesModule } from '../../theme/pipes/pipes.module';

export const routes = [
  { path: '', component: SearchComponent, pathMatch: 'full' }
];

@NgModule({
  declarations: [
    SearchComponent,
    DemoComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    SharedModule,
    NgAisModule,
    SwiperModule,
    FormsModule,
    PipesModule 
  ]
})
export class SearchModule { }

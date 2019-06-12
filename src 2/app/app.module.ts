import { BrowserModule } from '@angular/platform-browser';
import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgxSpinnerModule } from 'ngx-spinner';
import { AgmCoreModule } from '@agm/core';

import { OverlayContainer, Overlay } from '@angular/cdk/overlay';
import { MAT_MENU_SCROLL_STRATEGY, MatIconModule, MatInputModule, MatButtonModule, MatBadgeModule,
  MatExpansionModule, MatSidenavModule } from '@angular/material';
import { CustomOverlayContainer } from './theme/utils/custom-overlay-container';
import { menuScrollStrategy } from './theme/utils/scroll-strategy';

import { SharedModule } from './shared/shared.module';
import { routing } from './app.routing';
import { AppComponent } from './app.component';
import { PagesComponent } from './pages/pages.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { TopMenuComponent } from './theme/components/top-menu/top-menu.component';
import { MenuComponent } from './theme/components/menu/menu.component';
import { SidenavMenuComponent } from './theme/components/sidenav-menu/sidenav-menu.component';
import { BreadcrumbComponent } from './theme/components/breadcrumb/breadcrumb.component';

import { AppSettings } from './app.settings';
import { AppService } from './app.service';
import { AppInterceptor } from './theme/utils/app-interceptor';
import { OptionsComponent } from './theme/components/options/options.component';
import { FooterComponent } from './theme/components/footer/footer.component';

import { AuthService } from './services/auth/auth.service';
import { NgAisModule } from 'angular-instantsearch';
import { MidMenuComponent } from './theme/components/mid-menu/mid-menu.component';
// import { Select2OptionData } from 'ng2-select2';
import { Select2Module } from 'ng2-select2';
import { ClickOutDirective } from './shared/click-out.directive';
import { SearchboxComponent } from './theme/components/searchbox/searchbox.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Angular4PaystackModule } from 'angular4-paystack';
import { CarSelectComponent } from './theme/components/car-select/car-select.component';
import { SEOComponent } from './theme/components/seo/seo.component';

@NgModule({
   imports: [
    BrowserModule,
    NgAisModule.forRoot(),
    BrowserAnimationsModule,
    HttpClientModule,
    Select2Module,
    NgxSpinnerModule,
    AgmCoreModule.forRoot({
      apiKey: '#'
    }),
    SharedModule,
    routing,
    FormsModule, ReactiveFormsModule,  Angular4PaystackModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatBadgeModule,
    MatExpansionModule,
    MatSidenavModule
  ],
  declarations: [
    AppComponent,
    PagesComponent,
    NotFoundComponent,
    TopMenuComponent,
    MenuComponent,
    SidenavMenuComponent,
    BreadcrumbComponent,
    OptionsComponent,
    FooterComponent,
    MidMenuComponent,
    ClickOutDirective,
    SearchboxComponent,
    CarSelectComponent,
    SEOComponent,
  ],
  providers: [
    AppSettings,
    AppService,
    { provide: OverlayContainer, useClass: CustomOverlayContainer },
    { provide: MAT_MENU_SCROLL_STRATEGY, useFactory: menuScrollStrategy, deps: [Overlay] },
    { provide: HTTP_INTERCEPTORS, useClass: AppInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
  , schemas: [
    NO_ERRORS_SCHEMA
  ]
})
export class AppModule { }

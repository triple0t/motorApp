import { Routes, RouterModule, PreloadAllModules  } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';
import { PagesComponent } from './pages/pages.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { AuthGuard } from './services/auth/auth.guard';

export const routes: Routes = [
    { 
        path: '', 
        component: PagesComponent, children: [
            { path: '', loadChildren: './pages/home/home.module#HomeModule' },
            { path: 'account', loadChildren: './pages/account/account.module#AccountModule',  data: { breadcrumb: 'Account Settings', CanActivate: [AuthGuard]} },
            { path: 'compare', loadChildren: './pages/compare/compare.module#CompareModule', data: { breadcrumb: 'Compare' } },
            { path: 'wishlist', loadChildren: './pages/wishlist/wishlist.module#WishlistModule', data: { breadcrumb: 'Wishlist' } },
            { path: 'cart', loadChildren: './pages/cart/cart.module#CartModule', data: { breadcrumb: 'Cart' } },
            { path: 'checkout', loadChildren: './pages/checkout/checkout.module#CheckoutModule', data: { breadcrumb: 'Checkout', CanActivate: [AuthGuard] } },
            { path: 'contact', loadChildren: './pages/contact/contact.module#ContactModule', data: { breadcrumb: 'Contact' } },
            { path: 'sign-in', loadChildren: './pages/sign-in/sign-in.module#SignInModule', data: { breadcrumb: 'Sign In ' } },
            { path: 'brands', loadChildren: './pages/brands/brands.module#BrandsModule', data: { breadcrumb: 'Brands' } },
            { path: 'category', loadChildren: './pages/products/products.module#ProductsModule', data: { breadcrumb: 'Category' } },
            { path: 'product', loadChildren: './pages/products/product/product.module#ProductModule', data: { breadcrumb: 'Product' } },
            { path: 'search', loadChildren: './pages/search/search.module#SearchModule', data: { breadcrumb: 'Search Result' } },
            { path: 'coming-soon', loadChildren: './pages/coming-soon/coming-soon.module#ComingSoonModule', data: { breadcrumb: 'Coming-Soon' } },
            { path: 'thank-you', loadChildren: './pages/thank-you/thank-you.module#ThankYouModule', data: { breadcrumb: 'Thank-You' } }
        ]
    },
    { path: '**', component: NotFoundComponent }
];

export const routing: ModuleWithProviders = RouterModule.forRoot(routes, {
//    preloadingStrategy: PreloadAllModules,  // <- comment this line for activate lazy load
//    enableTracing: true 
   // useHash: true
});
// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

// export const environment = {
//   production: false,
//   algolia : {
//     apiKey: '40b4dd56d55992f05a476dcf16fa9620',
//     appId: 'F198JSQQ4D',
//     indexName: 'instant_search',
//     routing: true
//   }
// };
export const environment = {
  production: false,
  secret:'secret',
  algolia : {
    apiKey: 'e2b529766dcbe668bd6c3256f23046e6',
    appId: 'NL2F5GZ3BC',
    indexName: 'magento2_default_products',
    routing: true,
  },
  algoliacat : {
    apiKey: 'e2b529766dcbe668bd6c3256f23046e6',
    appId: 'NL2F5GZ3BC',
    indexName: 'magento2_default_categories',
    routing: true,
  },
  api : {
    base_magento_url : 'https://admin.motormata.com.ng',
    base_api_url : 'https://api.motormata.com.ng',
    base_url_mage : 'https://admin.motormata.com.ng/pub/media/catalog/product/'
  },
    apiUrl: 'http://localhost:8000/api/v1',
    paystack_key : 'pk_test_61bb5bbf339953f0508931ac9c9f7e7e6a66df12'
  
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.

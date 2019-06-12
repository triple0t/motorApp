export class Category {
  constructor(public id: number, 
              public name:string, 
              public hasSubCategory: boolean,
              public parentId: number){ }
}

export class Product {
  constructor(public id: number,
              public name: string,
              public images: Array<any>,
              public oldPrice: number,
              public newPrice: number,
              public discount: number,
              public ratingsCount: number,
              public ratingsValue: number,
              public description: string,
              public availibilityCount: number,
              public cartCount: number,
              public color: Array<string>,
              public size: Array<string>,
              public weight: number,
              public categoryId: number){ }
}
export class Customer{
  constructor(public id: number,
              public group_id: number,
              public default_billing: number,
              public created_at:Date,
              public updated_at:Date,
              public created_in:string,
              public email: string,
              public firstname:string,
              public lastname:string,
              public store_id:number,
              public website_id:number,
              public address:Array<any>,
              public disable_auto_change:number,
              public extension_attributes:Array<any>){ }
}

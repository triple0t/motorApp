import { Component, Inject, forwardRef } from '@angular/core';
import { BaseWidget, NgAisInstantSearch } from 'angular-instantsearch';
import { connectSearchBox } from 'instantsearch.js/es/connectors';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-searchbox',
  templateUrl: './searchbox.component.html',
  styleUrls: ['./searchbox.component.scss']
})
export class SearchboxComponent extends BaseWidget {
  searchForm: FormGroup;
    count:number;
  public state: {
     query: string;
     refine: Function;
     clear: Function;
     isSearchStalled: boolean;
     widgetParams: object;
  };
  results: any[] = [];
 queryField1: FormControl = new FormControl();
  constructor(
    @Inject(forwardRef(() => NgAisInstantSearch))
    public instantSearchParent, public router:Router
  ) {
    super('SearchBox');
    this.createWidget(connectSearchBox, {
      // instance options
    });     
    this.searchForm = new FormGroup({
      search: new FormControl()
   });
  }
  textAreaEmpty1(value){
    // console.log(value)      
    this.count = value.length
  }
  
  onSearchFormSubmit(value){
    // console.warn(value, this.searchForm.controls.value);
    this.router.navigate(['/search'], { queryParams: { search: value.search }, preserveFragment: true, queryParamsHandling: "merge" });
}

  goCategory(value){
    // console.log(value.name+'-'+value.objectID)
    this.router.navigate(['/category', value.name+'-'+value.objectID]);
  
  }
  
}

import { Component, Inject, forwardRef } from '@angular/core';
import { BaseWidget, NgAisInstantSearch } from 'angular-instantsearch';
import { connectSearchBox } from 'instantsearch.js/es/connectors';
import { FormControl } from '@angular/forms';
import { count } from 'rxjs/operators';

@Component({
  selector: 'app-demo',
  template: `
<input
  type="text"
  #input
  class="site-search_input js-site-search_input form-ctrl orly-header-search-input"
  (keyup)="this.state.refine(input.value)"
  [value]="this.state.query"
  (keyup)="textAreaEmpty(input.value)"
    matInput [formControl]="queryField" 
    [matAutocomplete]="auto">
        <mat-autocomplete #auto="matAutocomplete">
          <div *ngIf="count > 0">
            <ais-hits>
                <ng-template let-hits="hits">
                    <mat-option *ngFor="let hit of hits">
                        {{hit.name}}
                    </mat-option>
                </ng-template>
            </ais-hits>
          </div>
        </mat-autocomplete>
`
})
export class DemoComponent extends BaseWidget {
    count= 0;
  public state: {
     query: string;
     refine: Function;
     clear: Function;
     isSearchStalled: boolean;
     widgetParams: object;
  };
  results: any[] = [];
 queryField: FormControl = new FormControl();
  constructor(
    @Inject(forwardRef(() => NgAisInstantSearch))
    public instantSearchParent
  ) {
    super('SearchBox');
    this.createWidget(connectSearchBox, {
      // instance options
    });
  }
  textAreaEmpty(value){
    // if (value.length > 0) {
        // this.count = value.length;
        // console.log(value.length);
      // }
      
    this.queryField.valueChanges
    .subscribe( result =>{
      this.count = result.length,
      console.log(this.count)
    })
  }
  
}

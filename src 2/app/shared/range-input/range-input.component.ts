import { Component, Inject, forwardRef, Input } from '@angular/core';
import { BaseWidget, NgAisInstantSearch } from 'angular-instantsearch';
import { connectRange } from 'instantsearch.js/es/connectors';

@Component({
  selector: 'app-range-input',
  templateUrl: './range-input.component.html',
  styleUrls: ['./range-input.component.scss']
})
export class RangeInput extends BaseWidget {
  public state: {
    // render options
    start: number[];
    range: object;
    refine: Function;
    widgetParams: object;
  };

  constructor(
    @Inject(forwardRef(() => NgAisInstantSearch))
    public instantSearchParent
  ) {
    super ('RangeInput');
    this.createWidget(connectRange, {
      // instance options
      attribute: 'price.NGN.default',
    });
   }

}

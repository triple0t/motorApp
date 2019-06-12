import { Component, Inject, forwardRef, Input, OnInit, OnChanges } from '@angular/core';
import { BaseWidget, NgAisInstantSearch } from 'angular-instantsearch';
import { connectRefinementList } from 'instantsearch.js/es/connectors';
import { state } from '@angular/animations';

@Component({
  selector: 'app-refinement-list',
  templateUrl: './refinement-list.component.html',
  styleUrls: ['./refinement-list.component.scss']
})
export class RefinementList extends BaseWidget implements OnChanges{
 @Input() attributes;

  public state: {
    items: object[];
    refine: Function;
    createURL: Function;
    isFromSearch: boolean;
    searchForItems: Function;
    isShowingMore: boolean;
    canToggleShowMore: boolean;
    toggleShowMore: Function;
    widgetParams: object;
 };


  constructor(
    @Inject(forwardRef(() => NgAisInstantSearch))
    public instantSearchParent
  ) {
    super('RefinementList');
  }

  ngOnChanges() {
    this.createWidget(connectRefinementList, {
      // instance options
      attribute: this.attributes,
    });
  }
}

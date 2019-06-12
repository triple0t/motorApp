import { Directive , ElementRef, EventEmitter, Output, HostListener} from '@angular/core';

@Directive({
  selector: '[appClickOut]'
})
export class ClickOutDirective {
  constructor(private _elementRef: ElementRef) {
  }

  @Output()
  public clickOutside = new EventEmitter<MouseEvent>();

  @HostListener('document:click', ['$event', '$event.target'])
  public onClick(event: MouseEvent, targetElement: HTMLElement): void {
      if (!targetElement) {
          return;
      }

      const clickedInside = this._elementRef.nativeElement.contains(targetElement);
      if (!clickedInside) {
        console.log('whoops');
          this.clickOutside.emit(event);
      }
  }
}

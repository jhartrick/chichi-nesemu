import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[chichi-popover]',
})
export class PopoverDirective {
  constructor(public viewContainerRef: ViewContainerRef) { }
}
import { Directive, HostListener, HostBinding } from '@angular/core';

@Directive({
  selector: '[appDropdownn]'
})
export class DropdownnDirective {
  @HostBinding('class.open') isOpen = false;

  @HostListener('click') toggleOpen() {
    this.isOpen = !this.isOpen;
  }
  constructor() { }

}

import { Directive, ElementRef, OnInit, Input, Renderer2, Renderer, HostListener, HostBinding } from '@angular/core';
import { element } from 'protractor';

@Directive({
  selector: '[CustomColor]'
})
export class CustomColorDirective{
 
  constructor(ele:ElementRef, renderer:Renderer2){
   renderer.setStyle(ele.nativeElement,'color','yellow');
  }
 
}

@Directive({
  selector: '[appChbgcolor]'
})
export class ChangeBgColorDirective {
  constructor(private el: ElementRef, private renderer: Renderer) {
      // this.ChangeBgColor('red');
  }
  @HostBinding('style.border') border: string;
  @HostListener('mouseover') onMouseOver() {
      this.border = '5px solid green';
  }
  
}
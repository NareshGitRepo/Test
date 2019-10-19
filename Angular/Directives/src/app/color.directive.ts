import { Directive, ElementRef, OnInit, Input, Renderer2 } from '@angular/core';
import { element } from 'protractor';

@Directive({
  selector: '[appColor]'
})
export class ColorDirective implements OnInit{
 
  
  @Input() appColor: string;
  constructor(private ele:ElementRef) { 
    //static color
    // ele.nativeElement.style.backgroundColor='pink';
  }
  ngOnInit() {
    this.ele.nativeElement.style.backgroundColor=this.appColor;
  }

  
 
}

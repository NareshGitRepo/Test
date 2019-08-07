// import { Directive, HostListener, ElementRef, Input } from '@angular/core';
// @Directive({
//     selector: '[allow-camp-cal-characters]'
// })
// export class CampCalCharactersDirective {
//     // regexStr = '^[a-zA-Z0-9_&]*$';
//      regexStr =  /((0[1-9]|[12])[/](0[1-9]|[1-9]|[12]\d|3[01])[/](([2]\d)\d{2}), (0[0-9]|[0-9]|1[0-2]):(0[0-9]|[1-59]\d) (AM|am|PM|pm))$/;
 
//      constructor(private el: ElementRef) { }
//      // @HostListener('keypress', ['$event']) onKeyPress(event) {
//      //     console.log("event=>",event);
         
//      //     return new RegExp(this.regexStr).test(event.key);
//      // }
//      @HostListener('paste', ['$event']) blockPaste(event: KeyboardEvent) {
//          this.validateFields(event);
//      }
//      validateFields(event) {
//         let regexStr1 = new RegExp( /((0[1-9]|[12])[/](0[1-9]|[1-9]|[12]\d|3[01])[/](([2]\d)\d{2}), (0[0-9]|[0-9]|1[0-2]):(0[0-9]|[1-59]\d) (AM|am|PM|pm))$/);
       
//          setTimeout(() => {
//              //console.log("event=>1",this.el.nativeElement.value,regexStr1.test(this.el.nativeElement.value));
//              if(!regexStr1.test(this.el.nativeElement.value))
//              this.el.nativeElement.value =''; event.preventDefault();
//          }, 1)
//      }
 
//  }
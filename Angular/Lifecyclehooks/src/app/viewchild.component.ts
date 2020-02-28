import { Component, Input } from "@angular/core";

@Component({
    selector:'view-child',
template:'<h1>Hi {{name}}</h1>',
    styles:['h1{color:red}']
})
export class ViewchildComponent{
 @Input() name:string;

 getuser(){
     return 'hello';
 }
}
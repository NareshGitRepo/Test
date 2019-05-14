import { Component } from "@angular/core";

@Component({
 selector:'attribute',
 templateUrl:'attributes.component.html',
 styleUrls:['attributes.component.scss']
})

export class AttributesComponent{
 public atr:string='Selectors';
 public xyz:any='id_selector';
 public abc:string='custom_selector';
 public Class:string='class_selector';

 getClass(Class:any){
     return "return_Class_value  " +Class;
 }
}
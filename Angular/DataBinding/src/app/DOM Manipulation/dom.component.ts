import { Component } from "@angular/core";

@Component({
    selector:'dom',
    templateUrl:'dom.component.html',
    styleUrls:['dom.component.scss']
})

export class DomComponent{
    changeheight(event:any){
        var currentEleRef=event.target;
        var rowHeight=currentEleRef.offsetHeight;
        var adjustHeight=2*rowHeight;
        currentEleRef.style.height=adjustHeight+"px";
        currentEleRef.style.padding="100px";
        currentEleRef.style.marginRight= "100px";
       }

       changeHeight(event:any){
        var currentEleRef=event.target;
        if(!currentEleRef) return;
        var rowHeight=currentEleRef.offsetHeight;
        var rowWidth=currentEleRef.offsetWidth;
       var nextEleRef=currentEleRef.nextElementSibling;
       nextEleRef.style.height=rowHeight+"px";
       nextEleRef.style.width=rowWidth+"px";
       nextEleRef.style.marginLeft="20px";
       }

       public kgf:boolean=true;

}
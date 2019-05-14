import { Component } from "@angular/core";
import { HomeService } from '../home.service';

@Component({
    selector:'app-service',
    templateUrl:'service.component.html',
    styleUrls:['service.component.scss']
})

export class ServiceComponent{

    public Service:any=[];
    constructor( private homeservices:HomeService){
       this.homeservices.getService().subscribe(
           res =>{
               this.Service=res;
           }
       )
    }
}
import { Component } from "@angular/core";
import { HomeService } from '../service/home.service';

@Component({
    selector:'data-fetch',
    templateUrl:'datafetch.component.html',
    styleUrls:['datafetch.component.scss']
})

export class DatafetchComponent{
    public users:any=[];
    constructor(private homeservices:HomeService){
   
        this.homeservices.getUsers().subscribe(
            res => {
              this.users=res;
            }
          )
    }
    
      
}
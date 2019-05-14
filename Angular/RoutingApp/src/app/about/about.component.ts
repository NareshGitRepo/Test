import { Component } from "@angular/core";
import { HomeService } from '../home.service';

@Component({
    selector:'app-about',
    templateUrl:'about.component.html',
    styleUrls:['about.component.scss']
})

export class AboutComponent{

    public About:any=[];
    constructor(private homservices:HomeService){
 
        this.homservices.getAbout().subscribe(
            res =>{
                this.About=res;
            }
        )
    }
}
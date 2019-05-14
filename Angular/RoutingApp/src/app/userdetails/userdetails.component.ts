import { Component } from "@angular/core";
import { ActivatedRoute } from '@angular/router';
import { HomeService } from '../home.service';

@Component({
    selector:'app-userdetails',
    templateUrl:'userdetails.component.html',
    styleUrls:['userdetails.component.scss']
})

export class UserdetailsComponent{

     public userId:any=[];
    constructor( private route:ActivatedRoute, private homeservices:HomeService){
        
        this.route.params.subscribe( data =>{
                const userId=data.id;
                this.getUserdetails(userId);
            }
        )
    }

    getUserdetails(id){
        this.homeservices.getUserdetails(id).subscribe(
        responce =>{
                this.userId=responce;
            }
        )
    }
}
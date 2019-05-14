import { Component } from "@angular/core";
import { HomeService } from '../home.service';
import { Router } from '@angular/router';

@Component({
    selector:'app-user',
    templateUrl:'user.component.html',
    styleUrls:['user.component.scss']
})

export class UserComponent{

    public users:any=[];
    constructor(private homeservices:HomeService,private router:Router){
     
        this.homeservices.getUsers().subscribe(
            res =>{
                this.users=res;
            }
        )
    }
}
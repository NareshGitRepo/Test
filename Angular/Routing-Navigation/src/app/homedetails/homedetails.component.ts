import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, ParamMap} from '@angular/router';
import { HomeService } from '../home.service';
@Component({
  selector: 'app-homedetails',
  templateUrl: './homedetails.component.html',
  styleUrls: ['./homedetails.component.scss']
})
export class HomedetailsComponent implements OnInit {
  
  public homeId;
  public HomeId:any=[];
  constructor( private route:ActivatedRoute,private homeservices:HomeService){
   
    this.route.paramMap.subscribe ((params:ParamMap) =>{
      let id=parseInt(params.get('id'));
      this.homeId=id;
        });

    this.homeservices.getUserdetails(this.homeId).subscribe(
      res => {
        this.HomeId=res;
      }
  )
  }
   

  ngOnInit() {
  
  } //oninit()
   
}

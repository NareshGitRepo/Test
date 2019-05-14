import { Component, OnInit } from '@angular/core';
import { HomeService } from '../home.service';

@Component({
  selector: 'app-service',
  templateUrl: './service.component.html',
  styleUrls: ['./service.component.scss']
})
export class ServiceComponent implements OnInit {

  public comments:any=[];
    constructor(private homeservices:HomeService){
   
        this.homeservices.getComments().subscribe(
            res => {
              this.comments=res;
            }
          )
    }

  ngOnInit() {
  }

}

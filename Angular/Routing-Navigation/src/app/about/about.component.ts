import { Component, OnInit } from '@angular/core';
import { HomeService } from '../home.service';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {

  public post:any=[];
    constructor(private homeservices:HomeService){
   
        this.homeservices.getPosts().subscribe(
            res => {
              this.post=res;
            }
          )
    }

  ngOnInit() {
  }

}

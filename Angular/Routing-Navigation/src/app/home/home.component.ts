import { Component, OnInit } from '@angular/core';
import { HomeService } from '../home.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  public Home:any=[];
    constructor(private homeservices:HomeService, private router:Router){
   
        this.homeservices.getUsers().subscribe(
            res => {
              this.Home=res;
            }
        )
    }
  ngOnInit() {
  }

  onSelect(home){
    this.router.navigate(['/Users',home.id]);
  }
}

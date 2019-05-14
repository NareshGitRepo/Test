import { Component } from '@angular/core';
import { HomeService } from './home.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'APIMethods';

  public users:any=[];
  public comment:any=[];
  constructor(private homeservices:HomeService){
 
      this.homeservices.getUsers().subscribe(
          res => {
            this.users=res;
          }
        )

        this.homeservices.getComments().subscribe(
          res => {
            this.comment=res;
          }
        )
  }

  Size(id){
    if(id%2==0){
             return '20px';
    }
    else{
      return '15px';
    }
  }
  
  color(id){
    if(id%2==0){
             return 'gold';
    }
    else{
      return 'skyblue';
    }
  }
  size(){
    return 'container';
  }
}

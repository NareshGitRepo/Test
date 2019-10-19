import { Component } from '@angular/core';
import { MainService } from './main.service';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'RoomsInfo';
  public loginid:number=1;
  public username:string;
  public userid:number;
  Vuser:any={};
  constructor(private mainservice:MainService, private snackBar:MatSnackBar){}
  Uname(event){
    this.username=event.target.value;
    console.log(this.username);
    this.mainservice.validUser(this.username, this.loginid).subscribe(
      res =>{
        this.Vuser=res;
        console.log('Vuser',this.Vuser);
        let snackBarRef = this.snackBar.open(this.Vuser.messages,'',{duration:1000});
      },
      error=>{
        console.log('error') 
      }
    )
  }
  Uid(event){
    this.userid=event.target.value;
    this.mainservice.DeleteUserId(this.userid,this.loginid).subscribe(
      res =>{
        console.log('Uid',res);
      },
      error=>{
        let snackBarRef = this.snackBar.open('Not Deleted User Id','',{duration:1000});
        console.log('error') 
      }
    )
  }
}

import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public Name:string='Binding data';
  public xyz:string='Screen';

  ModifyData(event:any){
    let Data=event.target.value;
    this.Name=Data;
  }
  
  ChangeData(event:any){
    let data=event.target.value;
    this.xyz=data;
  }
  
}

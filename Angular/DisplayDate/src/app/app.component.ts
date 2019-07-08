import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'DisplayDate';
  change:any;
  flag:boolean=false;
  fromdate_control= new FormControl('',[Validators.required]);
  todate_control= new FormControl('',[Validators.required]);

  minDate = new Date(2019, 3, 1);
  maxDate = new Date();

  minDate1 = new Date(2019, 3, 1);
  maxDate1 = new Date();
   
  constructor(public datepipe: DatePipe){}

  ChangeFormat(){ 
    console.log('no change =>',this.fromdate_control.value)
    this.change =this.datepipe.transform(this.fromdate_control.value, 'dd-MMM-yyyy');
    console.log(this.change)
  }
  
  ChangeFormat1(){ 
    console.log('no change =>',this.todate_control.value)
    this.change =this.datepipe.transform(this.todate_control.value, 'dd-MMM-yyyy');
    console.log(this.change)
  }

  

}

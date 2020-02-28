import { Component, OnInit } from '@angular/core';
import { interval } from 'rxjs';

@Component({
  selector: 'app-angular-gauge',
  templateUrl: './angular-gauge.component.html',
  styleUrls: ['./angular-gauge.component.scss']
})
export class AngularGaugeComponent implements OnInit {

  value:number=70;
  colorvalue: (value: number) => string;
  constructor() { }

  ngOnInit() {
    interval(1000).subscribe(response => {
      this.value--;
    });
    this.colorvalue = function(value: number): string {
      if(value>5)
      return `green`;
      else
      return `red`; 
    };
  }
   transform(value: number): string {
    value = value > 0 ? value : 0;
    const Secounds: number = Math.floor(value / 60);
    const minutes: number = Math.floor(Secounds / 60);
    //let minutestext=minutes>0? (minutes+'').length==1? '0'+minutes : minutes+'' :'00';
    return ('00' + Math.floor(Secounds - minutes * 60)).slice(-2) + ':' + ('00' + Math.floor(value - Secounds * 60)).slice(-2);
  }
}

import { Component, OnInit, Input, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-svgcircle',
  templateUrl: './svgcircle.component.html',
  styleUrls: ['./svgcircle.component.scss']
})
export class SvgcircleComponent implements OnInit {
  @Input() value: number;
  @Input() timeoutVal: number;
  radius: number = 15;
  circumference = 2 * Math.PI * this.radius;
  dashoffset: number;
  colorvalue: string;

  constructor() {
    this.strokeprogress(0);
  }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.value.currentValue !== changes.value.previousValue) {
      this.strokeprogress(changes.value.currentValue);
    }
  }
  private strokeprogress(value: number) {
    console.log('value=>',value);
    const strokeprogress = value / this.timeoutVal;
    this.strokevalue(this.value)
    this.dashoffset = this.circumference * (1 - strokeprogress);
  }
  
  strokevalue(value) {  
    if (value >5) {
      this.colorvalue = "green"
    }
    else if(value<=5){
      this.colorvalue = "red"
    }
  }

  
  // #cae6ee
}

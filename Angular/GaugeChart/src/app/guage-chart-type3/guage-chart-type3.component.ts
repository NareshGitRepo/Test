import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-guage-chart-type3',
  templateUrl: './guage-chart-type3.component.html',
  styleUrls: ['./guage-chart-type3.component.scss']
})
export class GuageChartType3Component implements OnInit {

  canvasWidth = 400
  needleValue = 50
  centralLabel = '99'
  options = {
    hasNeedle: true,
    outerNeedle: false,
    needleColor: 'gray',
    needleStartValue: 10,
    needleUpdateSpeed: 1000,
    // arcColors: ['red','green','yellow','blue'],
    arcColors:[],
    arcDelimiters: [10, 60, 90],
    arcPadding: 5,
    arcPaddingColor: 'white',
    arcLabels: ['20', '65', '90'],
  }
  constructor() { } 

  ngOnInit() {
  }

}

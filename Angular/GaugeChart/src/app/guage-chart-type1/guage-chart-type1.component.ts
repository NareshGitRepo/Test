import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-guage-chart-type1',
  templateUrl: './guage-chart-type1.component.html',
  styleUrls: ['./guage-chart-type1.component.scss']
})
export class GuageChartType1Component implements OnInit {
   canvasWidth = 300
   needleValue = 20
   options = {
    hasNeedle: true,
    needleColor: "black",
    needleStartValue: 50,
    arcColors: ["rgb(255,84,84)","rgb(239,214,19)","rgb(61,204,91)"],
    arcDelimiters: [10,60],  //mulitple colors delimiters 10=>rgb(255,84,84),60=>rgb(239,214,19)
    rangeLabel: ["0","100"],
  };
  constructor() { }

  ngOnInit() {}
}

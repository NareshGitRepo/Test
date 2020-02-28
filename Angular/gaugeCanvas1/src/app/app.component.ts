import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { RadialGauge } from 'canvas-gauges';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'gaugeCanvas';
   @ViewChild('gauge1',{static:true}) gauge1:ElementRef;
   rdata=10;
  ngOnInit() {
   
  
    var gauge = new RadialGauge({
      renderTo: this.gauge1.nativeElement, // identifier of HTML canvas element or element itself
      width: 300,
    height: 300,
    title:"Patient Served:",
    value:30,
    minValue: 0,
    startAngle: 90,
    ticksAngle: 180,
    valueBox:false,
     valueInt:0,
    valueDec:0,
    maxValue: 100,
   units: "Building1 >>Floor1 >>Department1 >>Service1",
    majorTicks: [
        "0",
        "10",
        "20",
        "30",
        "40",
        "50",
        "60",
        "70",
        "80",
        "90",
        "100",
    ],
  minorTicks: 2,
  strokeTicks: true,
  highlights: [
    {
      "from": 0,
      "to": 20,
      "color": "lightblue"
    },
    {
      "from": 20,
      "to": 60,
      "color": "lightgreen"
    },
      {
          "from": 60,
          "to": 100,
          "color": "rgba(200, 50, 50, .75)"
      }
  ],
  colorPlate: "rgba(0, 0, 0, 0)",
  borderShadowWidth: 0,
  borders: false,
  colorMajorTicks:"black",
  colorMinorTicks:"black",
  colorTitle:"green",
  colorUnits:"black",
  colorNumbers:"black",
  // colorNeedle:"",
  // colorNeedleEnd: "",
  colorValueText:"black",
  colorValueTextShadow:"rgba(0, 0, 0, 0)",
  colorBorderShadow:"rgba(0, 0, 0, 0)",
  colorValueBoxRect:"rgba(0, 0, 0, 0)",
  colorValueBoxRectEnd:"rgba(0, 0, 0, 0)",
  colorValueBoxBackground:"rgba(0, 0, 0, 0)",
  colorValueBoxShadow:"rgba(0, 0, 0, 0)",
  needleType: "arrow",
  needleWidth: 2,
  needleCircleSize: 7,
  needleCircleOuter: true,
  needleCircleInner: false,
  animationDuration: 1500,
  animationRule: "linear",
    
});
  // draw initially
  gauge.draw();
  // animate
  setInterval(() => {
     gauge.value = Math.random() * -100 + 100;
    // gauge.value=35;
  }, 3000);

  
 }

}

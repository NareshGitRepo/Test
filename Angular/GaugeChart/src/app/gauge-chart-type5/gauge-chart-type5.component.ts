import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-gauge-chart-type5',
  templateUrl: './gauge-chart-type5.component.html',
  styleUrls: ['./gauge-chart-type5.component.scss']
})
export class GaugeChartType5Component implements OnInit {

    chartWidth = 400
    needleValue = 20
    // centralLabel = '85%'
    options = {
  	arcColors: ["rgb(44,151,222)","lightgray"],
  	arcDelimiters: [80],
    rangeLabel: ["0%","100%"],
    
  }



  constructor() {

  



      
  }

  ngOnInit() {
  

  }

}

import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-guage-chart-type2',
  templateUrl: './guage-chart-type2.component.html',
  styleUrls: ['./guage-chart-type2.component.scss']
})
export class GuageChartType2Component implements OnInit {

   chartWidth = 400
   needleValue = 20
   centralLabel = '45'
   options = {
    hasNeedle: true,
    outerNeedle: true,
    needleColor: "rgb(166,206,227)",
    rangeLabel: ["-10","10"],
    centralLabel: "5",
    rangeLabelFontSize: 42,
  }
  constructor() { }

  ngOnInit() {
  }

}

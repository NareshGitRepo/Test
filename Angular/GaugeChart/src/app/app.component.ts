import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'GaugeChart';

  public canvasWidth = 300
  public needleValue = 65
  public centralLabel = ''
  public name = 'Gauge chart'
  public bottomLabel = '65' 
  public options = {
    hasNeedle: true,
    //outerNeedle:true,
    needleColor: 'gray',
    needleUpdateSpeed: 1000,
    //arcColors: ['rgb(44, 151, 222)', 'lightgray'],
    arcColors:['black','black','black','black','black','black','black','black','black','black','black','black','black','black','black','black','black','black','black','black','black','black','black','black','black','black','black','black','black','black'],
    arcDelimiters: [1,2,6,10,14,18,22,26,30,34,38,42,46,50,54,58,62,66,70,74,78,82,86,90,94,98],
    arcPadding: 5,
    arcPaddingColor: 'white',
    rangeLabel: ['0', '100'],
    // rangeLabel: ['0%', '100%'],
    needleStartValue: 50,
    //rangeLabelFontSize: 25
  }
  
}

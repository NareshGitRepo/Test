import { Component, OnInit } from '@angular/core';
import * as Highcharts from 'highcharts';
// import * as Highcharts from 'highcharts/highcharts-more';
import Solidgauge from 'highcharts/modules/solid-gauge';
 Solidgauge(Highcharts)
 declare var require: any;
 require('highcharts/highcharts-more')(Highcharts);

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'gaugeHighChart';
  tokensdata=[];
  data:Array<any>=[{
    hospitalname:"sdf",tokens:20
  },
  {
    hospitalname:"ert",tokens:37
  },{
    hospitalname:"iuy",tokens:72
  }];
  constructor(){
   this.data.forEach(x=>{
     this.tokensdata.push(x.tokens)
   })
   console.log(this.tokensdata)
  }
   ngOnInit(){
    //  setTimeout(() => {
    //   var chartSpeed= Highcharts.chart('container-speed', {
    //     chart: {
    //       type: 'solidgauge',
    //       renderTo:'container-speed',
    //     },
  
    //     title: null,
  
    //     pane: {
    //       center: ['50%', '85%'],
    //       size: '140%',
    //       startAngle: -90,
    //       endAngle: 90,
    //       background: [{
    //           //  backgroundColor: Highcharts.defaultOptions.legend.backgroundColor || '#EEE',
    //           backgroundColor:{ linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 }, stops: [[0, '#ffffff'], [1, '#e6e6e6']] },
    //           innerRadius: '85%',
    //           outerRadius: '115%',
    //           shape: 'arc',
    //           borderWidth:1,
    //       }]
    //     },
  
    //     tooltip: {
    //       enabled: true
    //     },
  
    //     // the value axis
    //     yAxis: {
    //       min:0,
    //       max:10,
    //       lineWidth: 0,
    //       minorTickInterval:'auto',
    //       minorTickWidth: 1,
    //       minorTickLength: 11,
    //       minorTickPosition: 'inside',
    //       minorTickColor: '#666',
    //       tickPixelInterval: 30,
    //       tickWidth: 2,
    //       tickPosition: 'inside',
    //       tickLength: 11,
    //       tickColor: '#666',
    //       // tickAmount: 2,
    //       title: {
    //           y: 70,
    //       },
    //       labels: {
    //           y:0,
    //           distance: 7,
    //           step:0.5,
    //           rotation:0
    //       },
    //       // plotBands: [{
    //       //   from: 0,
    //       //   to: 50,
    //       //   color: '#55BF3B', // green
    //       //   borderColor:'#55BF3B',
    //       //   borderWidth:5
    //       // }, {
    //       //   from: 50,
    //       //   to: 140,
    //       //   color: '#DDDF0D', // yellow
    //       //   borderColor:'#DDDF0D',
    //       //   borderWidth:5
    //       // }, {
    //       //   from: 140,
    //       //   to: 200,
    //       //   color: '#DF5353', // red
    //       //   borderColor:'#DF5353',
    //       //   borderWidth:5
    //       // }],
          

    //     },
      
    //     plotOptions: {
    //       solidgauge: {
    //           dataLabels: {
    //               y:0,
    //               borderWidth: 0,
    //               useHTML: true
    //           }
    //       }
    //     },
    //     credits:{
    //       enabled:false
    //     },
    //     series:[{
    //       type:'gauge',
    //       name:'Speed',
    //       data: [3],
    //       dataLabels: [{
    //           format:
    //               '<div style="text-align:top">' +
    //               '<span style="font-size:25px">{y}</span><br/>' +
    //               '<span style="font-size:12px;opacity:0.4">km/h</span>'+
    //               '</div>',
    //               // align:'center',
    //               style:{ color:'skyblue',fontSize:'11px'},
    //               // verticalAlign:'bottom'
    //       }],
    //       tooltip: {
    //           valueSuffix: ' km/h'
    //       }
    //     }],
    //   });
  
    //   // setInterval(function () {
    //   //   // Speed
    //   //   var point,
    //   //       newVal,
    //   //       inc;
    
    //   //   if (chartSpeed) {
    //   //       point = chartSpeed.series[0].points[0];
    //   //       inc = Math.round((Math.random() - 0.5) * 100);
    //   //       newVal = point.y + inc;
    
    //   //       if (newVal < 0 || newVal > 10) {
    //   //           newVal = point.y - inc;
    //   //       }
    
    //   //       point.update(newVal);
    //   //   }
    //   // }, 3000);
    //  }, 300)
    
   setTimeout(() => {
    var chartSpeed= Highcharts.chart('container-speed', {
      chart: {
        type: 'solidgauge',
        renderTo:'container-speed',
      },

      title: null,

      pane: {
        center: ['50%', '85%'],
        size: '140%',
        startAngle: -90,
        endAngle: 90,
        background: [{
            //  backgroundColor: Highcharts.defaultOptions.legend.backgroundColor || '#EEE',
            backgroundColor:{ linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 }, stops: [[0, '#ffffff'], [1, '#e6e6e6']] },
            innerRadius: '85%',
            outerRadius: '115%',
            shape: 'arc'
        }]
      },

      tooltip: {
        enabled: true
      },

      // the value axis
      yAxis: {
        min:0,
        max:200,
        lineWidth: 0,
        minorTickInterval:'auto',
        minorTickWidth: 1,
        minorTickLength: 10,
        minorTickPosition: 'inside',
        minorTickColor: '#666',
        tickPixelInterval: 30,
        tickWidth: 2,
        tickPosition: 'inside',
        tickLength: 10,
        tickColor: '#666',
        // tickAmount: 2,
        title: {
            y: 0,
        },
        labels: {
            y: 0,
            distance: 7,
        },
        plotBands: [{
          from: 0,
          to: 50,
          color: '#55BF3B', // green
          borderColor:'#55BF3B',
        }, {
          from: 50,
          to: 140,
          color: '#DDDF0D', // yellow
          borderColor:'#DDDF0D',
        }, {
          from: 140,
          to: 200,
          color: '#DF5353', // red
          borderColor:'#DF5353'
       }],

      },
    
      plotOptions: {
        solidgauge: {
            dataLabels: {
                // y: 0,
                borderWidth: 0,
                useHTML: true
            }
        }
      },
      credits:{
        enabled:false
      },
      series:[{
        type:'gauge',
        data: [13],
        dataLabels: [{
            format:
                '<div style="text-align:center">' +
                '<span style="font-size:25px">{y}</span><br/>' +
                '<span style="font-size:12px;opacity:0.4">Tokens</span>'+
                '</div>',
                // align:'center',
                style:{ color:'red',fontSize:'11px'},
                // verticalAlign:'bottom'
        }],
        tooltip: {
            valueSuffix: 'Tokens'
        }
      }],
    });

    // setInterval(function () {
    //   // Speed
    //   var point,
    //       newVal,
    //       inc;
  
    //   if (chartSpeed) {
    //       point = chartSpeed.series[0].points[0];
    //       inc = Math.round((Math.random() - 0.5) * 100);
    //       newVal = point.y + inc;
  
    //       if (newVal < 0 || newVal > 200) {
    //           newVal = point.y - inc;
    //       }
  
    //       point.update(newVal);
    //   }
    // }, 1000);
   }, 1000)

   } //oninit
}

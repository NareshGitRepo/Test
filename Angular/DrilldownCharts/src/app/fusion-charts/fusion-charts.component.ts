import { Component, OnInit } from '@angular/core';
// Include the core fusioncharts file from core  -
import FusionCharts from 'fusioncharts/core';

// Include the chart from viz folder
// E.g. - import ChartType from fusioncharts/viz/[ChartType]
import Column2D from 'fusioncharts/viz/column2d';

// Include the fusion theme
import FusionTheme from 'fusioncharts/themes/es/fusioncharts.theme.fusion';

// Add the chart and theme as dependencies
// E.g. FusionCharts.addDep(ChartType)
FusionCharts.addDep(Column2D);
FusionCharts.addDep(FusionTheme);

@Component({
  selector: 'app-fusion-charts',
  templateUrl: './fusion-charts.component.html',
  styleUrls: ['./fusion-charts.component.scss']
})
export class FusionChartsComponent implements OnInit {

  constructor() { 
    FusionCharts.ready(function() {
      var satisfactionChart = new FusionCharts({
        type: 'column2d',
        renderAt: 'chart-container',
        width: '400',
        height: '300',
        dataFormat: 'json',
        dataSource: {
          "chart": {
            "caption": "Top 3 Juice Flavors",
            "subcaption": "Last year",
            "xaxisName": "Flavor",
            "yaxisName": "Amount (In USD)",
            "numberPrefix": "$",
            "theme": "fusion"
          },
          "data": [{
            "label": "Apple",
            "value": "810000",
            "link": "newchart-xml-apple"
          }, {
            "label": "Cranberry",
            "value": "620000",
            "link": "newchart-xml-cranberry"
          }, {
            "label": "Grapes",
            "value": "350000",
            "link": "newchart-xml-grapes"
          }],
          "linkeddata": [{
            "id": "apple",
            "linkedchart": {
              "chart": {
                "caption": "Apple Juice - Quarterly Sales",
                "subcaption": "Last year",
                "xaxisname": "Quarter",
                "yaxisname": "Amount (In USD)",
                "numberprefix": "$",
                "theme": "fusion",
                "rotateValues": "0"
              },
              "data": [{
                "label": "Q1",
                "value": "157000"
              }, {
                "label": "Q2",
                "value": "172000"
              }, {
                "label": "Q3",
                "value": "206000"
              }, {
                "label": "Q4",
                "value": "275000",
                "rotateValues": "0"
              }]
            }
          }, {
            "id": "cranberry",
            "linkedchart": {
              "chart": {
                "caption": "Cranberry Juice - Quarterly Sales",
                "subcaption": "Last year",
                "xaxisname": "Quarter",
                "yaxisname": "Amount (In USD)",
                "numberprefix": "$",
                "theme": "fusion",
                "rotateValues": "0"
              },
              "data": [{
                "label": "Q1",
                "value": "102000"
              }, {
                "label": "Q2",
                "value": "142000"
              }, {
                "label": "Q3",
                "value": "187000"
              }, {
                "label": "Q4",
                "value": "189000"
              }]
            }
          }, {
            "id": "grapes",
            "linkedchart": {
              "chart": {
                "caption": "Grape Juice - Quarterly Sales",
                "subcaption": "Last year",
                "xaxisname": "Quarter",
                "yaxisname": "Amount (In USD)",
                "numberprefix": "$",
                "theme": "fusion",
                "rotateValues": "0"
              },
              "data": [{
                "label": "Q1",
                "value": "45000"
              }, {
                "label": "Q2",
                "value": "72000"
              }, {
                "label": "Q3",
                "value": "95000"
              }, {
                "label": "Q4",
                "value": "108000"
              }]
            }
          }]
        }
      });
    
      satisfactionChart.render();
    
    });
    
  }

  
  ngOnInit() {
    
  }

  
}

import { CommonModule } from '@angular/common';
import { Component, OnInit, Input } from '@angular/core';
import * as Highcharts from 'highcharts';
import More from 'highcharts/highcharts-more';
import Exporting from 'highcharts/modules/exporting';
import { HighchartsChartModule } from 'highcharts-angular';


More(Highcharts);
Exporting(Highcharts);

@Component({
  selector: 'app-tempchart',
  standalone: true,
  imports: [CommonModule, HighchartsChartModule],
  templateUrl: './tempchart.component.html',
  styleUrl: './tempchart.component.css'
})
export class TempchartComponent implements OnInit {
  @Input() temperatureData!: any[];  

  Highcharts: typeof Highcharts = Highcharts;  
  chartOptions!: Highcharts.Options;  

  ngOnInit(): void {
    this.chartOptions = {
      chart: {
        type: 'arearange',
        zooming: {
          type: 'x'
        },
      },
      title: {
        text: 'Temperature Ranges (Min, Max)'
      },
      xAxis: {
        type: 'datetime',
        accessibility: {
          rangeDescription: 'Date range of the weather data.'
        }
      },
      yAxis: {
        title: {
          text: null
        }
      },
      tooltip: {
        crosshairs: true,
        shared: true,
        valueSuffix: '°F',
        xDateFormat: '%A, %b %e'
      }as any,
      legend: {
        enabled: false
      },
      series: [{
        type: 'arearange',
        name: 'Temperatures',
        data: this.temperatureData,
        color: {
          linearGradient: {
            x1: 0,
            x2: 0,
            y1: 0,
            y2: 1
          },
          stops: [
            [0, '#ff9100'], 
            [1, '#2aabfb']
          ]
        }
      }]
    };
  }
}
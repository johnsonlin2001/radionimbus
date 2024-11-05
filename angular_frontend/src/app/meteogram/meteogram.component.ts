import { CommonModule } from '@angular/common';
import { Component, OnInit, Input } from '@angular/core';
import * as Highcharts from 'highcharts';
import More from 'highcharts/highcharts-more';
import Exporting from 'highcharts/modules/exporting';
import { HighchartsChartModule } from 'highcharts-angular';
import Windbarb from 'highcharts/modules/windbarb';


More(Highcharts);
Exporting(Highcharts);
Windbarb(Highcharts);

@Component({
  selector: 'app-meteogram',
  standalone: true,
  imports: [CommonModule, HighchartsChartModule],
  templateUrl: './meteogram.component.html',
  styleUrl: './meteogram.component.css'
})
export class MeteogramComponent implements OnInit {
  @Input() hourlyTempData!: any[];
  @Input() hourlyHumData!: any[];
  @Input() hourlyWindData!: any[];
  @Input() hourlyAirData!: any[];

  Highcharts: typeof Highcharts = Highcharts;  
  chartOptions!: Highcharts.Options;  

  ngOnInit(): void {
    console.log(this.hourlyTempData);
    this.chartOptions = {
      chart: {
        type: 'spline',
        zooming:{type: "x"},
        events: {
          load: function () {
            const chart = this;
            //Meteogram.prototype.drawBlocksForWindArrows(chart);
          }
        },
        height: 400, // Adjust for mobile using responsive rules below
        spacingTop: 10,
        spacingRight: 10,
        spacingBottom: 15,
        spacingLeft: 10,
      },
      title: {
        text: 'Hourly Weather (For Next 5 Days)',
        style: {
          fontSize: '16px'
        }
      },
      xAxis: [{
        type: 'datetime',
        tickInterval: 2 * 36e5,
        minorTickInterval: 36e5,
        labels: {
          format: '{value:%H}',
          align: 'center',
          style: {
            fontSize: '10px' // Smaller labels for narrow screens
          }
        },
        crosshair: true
      }, {
        linkedTo: 0,
        type: 'datetime',
        tickInterval: 24 * 3600 * 1000,
        labels: {
          format: '{value:<span style="font-size: 12px; font-weight: bold">%a</span> %b %e}',
          align: 'left',
          x: 3,
          y: 8
        },
        opposite: true,
        tickLength: 20,
        gridLineWidth: 1
      }],
      yAxis: [{
        title: {
          text: null
        },
        labels: {
          format: '{value}°',
          style: {
            fontSize: '10px'
          }
        },
        tickInterval: 7,
        min: 0,
        max: 105
      }, {
        title: {
          text: null
        },
        labels: {
          enabled: false
        },
        min: 0,
        max: 100,
        gridLineWidth: 0,
        opposite: true
      }, {
        title: {
          text: null
        },
        labels: {
          format: '{value} mph',
          enabled: false
        },
        opposite: true
      }, {
        title: {
          text: null
        },
        labels: {
          format: '{value} inHg',
          style: {
            fontSize: '10px'
          }
        },
        opposite: true,
        gridLineWidth: 0
      }],
      tooltip: {
        shared: true,
        useHTML: true,
        headerFormat: '<small>{point.x:%A, %b %e, %H:%M}</small><br/>',
        pointFormat: '<span style="color:{point.color}">\u25CF</span> {series.name}: <b>{point.y}</b><br/>'
      },
      plotOptions: {
        series: {
          marker: {
            radius: 2 // Smaller markers for mobile
          }
        },
        column: {
          dataLabels: {
            enabled: true,
            align: 'center',
            verticalAlign: 'bottom',
            style: {
              fontSize: '10px',
            }
          }
        }
      },
      responsive: {
        rules: [
          {
            condition: {
              maxWidth: 480 // Apply rules on mobile screens
            },
            chartOptions: {
              chart: {
                height: 300 // Reduce height for mobile
              },
              yAxis: [{
                title: {
                  text: null
                },
                labels: {
                  format: '{value}°',
                  style: {
                    fontSize: '8px'
                  }
                }
              }, {
                title: {
                  text: null
                },
                labels: {
                  enabled: false
                }
              }, {
                title: {
                  text: null
                },
                labels: {
                  enabled: false
                }
              }, {
                title: {
                  text: null
                },
                labels: {
                  format: '{value} inHg',
                  style: {
                    fontSize: '8px'
                  }
                }
              }],
              xAxis: [{
                labels: {
                  format: '{value:%H}', // Hourly format for mobile
                  style: {
                    fontSize: '8px'
                  }
                }
              }],
              tooltip: {
                style: {
                  fontSize: '10px'
                }
              },
              legend: {
                enabled: false
              }
            }
          }
        ]
      },
      series: [{
        name: 'Temperature',
        type: 'spline',
        data: this.hourlyTempData,
        color: "#FF3333",
        zIndex: 2,
        marker: {
          enabled: false,
        },
        tooltip: {
          valueSuffix: ' °F'
        },
      }, {
        name: 'Humidity',
        type: 'column',
        data: this.hourlyHumData,
        yAxis: 1,
        zIndex: 1,
        tooltip: {
          valueSuffix: ' %'
        }
      }, {
        name: 'Wind Speed',
        type: 'windbarb',
        data: this.hourlyWindData,
        vectorLength: 16,
        pointPlacement: 'between',
        pointRange: 2 * 36e5,
        zIndex: 2,
        color: "#333e41",
        tooltip: {
          pointFormat: '<span style="color:{point.color}">\u25CF</span>Wind Speed: <b>{point.value}</b><br/>',
          valueSuffix: ' mph'
        }
      }, {
        name: 'Air Pressure',
        type: 'spline',
        data: this.hourlyAirData,
        color: "#ffae00",
        yAxis: 3,
        zIndex: 2,
        dashStyle: 'ShortDot',
        marker: {
          enabled: false,
        },
        tooltip: {
          valueSuffix: ' inHg'
        }
      }]


    }}

}

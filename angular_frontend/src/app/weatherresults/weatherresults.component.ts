import { Component, Input, OnInit, Output, EventEmitter} from '@angular/core';
import { CommonModule, formatCurrency } from '@angular/common';
import { TempchartComponent } from '../tempchart/tempchart.component';
import { MeteogramComponent } from '../meteogram/meteogram.component';
import { trigger, transition, style, animate } from '@angular/animations';
import { DetailsPaneComponent } from '../details-pane/details-pane.component';

@Component({
  selector: 'app-weatherresults',
  standalone: true,
  imports: [CommonModule, TempchartComponent, MeteogramComponent, DetailsPaneComponent],
  templateUrl: './weatherresults.component.html',
  styleUrl: './weatherresults.component.css',
  animations: [
    trigger('slideLeftOut', [
      transition(':enter', [
        style({ transform: 'translateX(-100%)' }),
        animate('300ms ease-out', style({ transform: 'translateX(0)' }))
      ]),
      transition(':leave', [
        animate('300ms ease-in', style({ transform: 'translateX(-100%)' }))
      ])
    ]),
    trigger('slideRightIn', [
      transition(':enter', [
        style({ transform: 'translateX(100%)' }),
        animate('300ms ease-out', style({ transform: 'translateX(0)' }))
      ]),
      transition(':leave', [
        animate('300ms ease-in', style({ transform: 'translateX(100%)' }))
      ])
    ])
  ]
})
export class WeatherresultsComponent{

  @Input() dailydata: any;
  @Input() hourlydata: any;
  @Input() latitude: any;
  @Input() longitude: any;

  @Input() currentTemp!: number;
  @Input() weatherCondition!: string;
  @Input() weatherIcon!: string;
  @Input() humidity!: string;
  @Input() pressure!: string;
  @Input() windSpeed!: string;
  @Input() visibility!: string;
  @Input() cloudCover!: string;
  @Input() uvIndex!: number;
  @Input() location!: string;
  @Input() isFavorite!: boolean;
  @Output() toggleFavorite = new EventEmitter<boolean>();

  showResults = true;
  showDetailsPane = false;

  currentTab: string = "day";

  weatherHeadings = ['#', 'Date', 'Status', 'Temp. High (°F)', 'Temp. Low (°F)', 'Wind Speed (mph)'];

  selectedDay: any;
  animateResults = false;
  selectedStatus: any;

  showDetails(day: any, status: any) {
    console.log(day);
    this.animateResults = true;
    this.selectedDay = day;
    this.showResults = false;
    this.selectedStatus = status;
    setTimeout(() => {
      this.showDetailsPane = true;
    }, 350);
  }

  detailsClick(){
    if (!this.selectedDay && !this.selectedStatus) {
      const firstDay = this.dailydata['data']['timelines'][0]['intervals'][0];
      this.selectedDay = firstDay;
      this.selectedStatus = this.getStatus(firstDay['values']['weatherCode']);
    }
    this.showResults = false;
    setTimeout(() => {
      this.showDetailsPane = true;
    }, 350);
  }

  hideDetailsPane() {
    this.showDetailsPane = false;
    setTimeout(() => {
      this.showResults = true;
    }, 350); 
  }

  getTemperatureData(dailydata:any){
    let temperatureData = [];
    let weeklyData = dailydata["data"]["timelines"]["0"]["intervals"];

    for(let day of weeklyData){
        let date = day["startTime"];
        date = new Date(date);
        date = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
        let tempLow = day["values"]["temperatureMin"];
        let tempHigh = day["values"]["temperatureMax"];
        temperatureData.push([date, tempLow, tempHigh]);
    }
    return temperatureData;
  };

  getHourlyTempData(hourlydata:any){
    let hourlyData = hourlydata["data"]["timelines"]["0"]["intervals"];

    let hourlyTempData = [];
    let hourlyHumData = [];
    let hourlyAirData = [];
    let hourlyWindData = [];

    for(let hour of hourlyData){
        let date = hour["startTime"];
        let date1 = new Date(date);  
        let pstDate = new Date(date1.getTime() - (7 * 60 * 60 * 1000));
        let pstTime = pstDate.getTime();
        let temp = hour["values"]["temperature"];
        let humidity = hour["values"]["humidity"];
        let pressure = hour["values"]["pressureSeaLevel"];
        let windspeed = hour["values"]["windSpeed"];
        let winddirection = hour["values"]["windDirection"];

        hourlyTempData.push([pstTime, temp]);
        hourlyHumData.push([pstTime, humidity]);
        hourlyAirData.push([pstTime, pressure]);
        if (pstDate.getHours()%2===0) {
        hourlyWindData.push([pstTime, windspeed, winddirection]);
        };

        
    }

    return { hourlyTempData, hourlyHumData, hourlyAirData, hourlyWindData};
  }

  weatherCodes:Record<number, string> = {
    0: "Unknown",
    1000: "Clear",
    1100: "Mostly Clear",
    1101: "Partly Cloudy",
    1102: "Mostly Cloudy",
    1001: "Cloudy",
    2000: "Fog",
    2100: "Light Fog",
    4000: "Drizzle",
    4001: "Rain",
    4200: "Light Rain",
    4201: "Heavy Rain",
    5000: "Snow",
    5001: "Flurries",
    5100: "Light Snow",
    5101: "Heavy Snow",
    6000: "Freezing Drizzle",
    6001: "Freezing Rain",
    6200: "Light Freezing Rain",
    6201: "Heavy Freezing Rain",
    7000: "Ice Pellets",
    7101: "Heavy Ice Pellets",
    7102: "Light Ice Pellets",
    8000: "Thunderstorm"
};

  weatherImages:Record<number, string> = {
    0: "Unknown",
    1000: "clear_day.svg",
    1100: "mostly_clear_day.svg",
    1101: "partly_cloudy_day.svg",
    1102: "mostly_cloudy.svg",
    1001: "cloudy.svg",
    2000: "fog.svg",
    2100: "fog_light.svg",
    4000: "drizzle.svg",
    4001: "rain.svg",
    4200: "rain_light.svg",
    4201: "rain_heavy.svg",
    5000: "snow.svg",
    5001: "flurries.svg",
    5100: "snow_light.svg",
    5101: "snow_heavy.svg",
    6000: "freezing_drizzle.svg",
    6001: "freezing_rain.svg",
    6200: "freezing_rain_light.svg",
    6201: "freezing_rain_heavy.svg",
    7000: "ice_pellets.svg",
    7101: "ice_pellets_heavy.svg",
    7102: "ice_pellets_light.svg",
    8000: "tstorms.svg"
}

  getStatus(weatherCode: number): string {
    return this.weatherCodes[Number(weatherCode)] || 'Unknown';
  }
  
  getWeatherImage(weatherCode: number): string {
    return `/Images/Weather_Symbols/${this.weatherImages[weatherCode]}`;
  }

  handleTabClick(tab: string){
    this.currentTab = tab;
  }

  async handleFavorite() {
    this.isFavorite = !this.isFavorite;
    this.toggleFavorite.emit(this.isFavorite);
    const [city, state] = this.location.split(", ").map(part => part.trim());
    if(this.isFavorite){
    const addfav = await fetch(`http://localhost:8080/addfavorites?city=${city}&state=${state}&lat=${this.latitude}&long=${this.longitude}`, {method: 'post'});
    }else{
    const delfav = await fetch(`http://localhost:8080/deletefavorite?city=${city}&state=${state}`, {method: 'delete'});
    }
  }

  formatDate(dateinput: string): string {
    const date = new Date(dateinput);
    return new Intl.DateTimeFormat('en-US', {weekday: 'long', year: 'numeric', month: 'short', day: '2-digit'}).format(date);
  }




}

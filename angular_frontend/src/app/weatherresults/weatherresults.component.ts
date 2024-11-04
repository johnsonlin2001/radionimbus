import { Component, Input } from '@angular/core';
import { CommonModule, formatCurrency } from '@angular/common';

@Component({
  selector: 'app-weatherresults',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './weatherresults.component.html',
  styleUrl: './weatherresults.component.css'
})
export class WeatherresultsComponent {

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

  isFavorite: boolean = false;

  currentTab: string = "day";

  weatherHeadings = ['#', 'Date', 'Status', 'Temp. High (°F)', 'Temp. Low (°F)', 'Wind Speed (mph)'];

  handleTabClick(tab: string){
    this.currentTab = tab;
  }

  handleFavorite() {
    this.isFavorite = !this.isFavorite;
  }

}

import { Component, Input, Output, EventEmitter, AfterViewInit, ViewChild, ElementRef } from '@angular/core';

/// <reference types="google.maps" />

@Component({
  selector: 'app-details-pane',
  standalone: true,
  imports: [],
  templateUrl: './details-pane.component.html',
  styleUrl: './details-pane.component.css', 
})
export class DetailsPaneComponent implements AfterViewInit{
  @ViewChild('mapContainer', { static: false }) mapContainer!: ElementRef;
  @Input() weatherData!: any;
  @Input() status!: any;
  @Input() lat!: any;
  @Input() long!: any;

  @Output() close = new EventEmitter<void>();

  private map!: google.maps.Map;
  
  ngAfterViewInit() {
    this.initMap();
  }

  

  private async initMap(): Promise<void> {
    const { Map } = await google.maps.importLibrary("maps") as google.maps.MapsLibrary;

    this.map = new Map(this.mapContainer.nativeElement, {
      center: { lat: parseFloat(this.lat), lng: parseFloat(this.long) },
      zoom: 8,
    });
  }

  closeDetailsPane() {
    this.close.emit();
  }

  formatDate(dateinput: string): string {
    const date = new Date(dateinput);
    return new Intl.DateTimeFormat('en-US', {weekday: 'long', year: 'numeric', month: 'short', day: '2-digit'}).format(date);
  }

  formatTime(timeinput: string): string{
    const time = new Date(timeinput);
    const options: Intl.DateTimeFormatOptions = { 
      hour: 'numeric', 
      minute: 'numeric', 
      hour12: true, 
      timeZone: 'America/Los_Angeles' 
  };
  return new Intl.DateTimeFormat('en-US', options).format(time);
  }

}

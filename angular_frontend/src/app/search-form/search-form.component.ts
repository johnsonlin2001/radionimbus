import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormControl, ReactiveFormsModule, FormGroup } from '@angular/forms';

import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { MatOptionModule } from '@angular/material/core';
import { CommonModule, formatCurrency } from '@angular/common';
import { CitysearchService } from "../citysearch.service"
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { WeatherresultsComponent } from '../weatherresults/weatherresults.component';


@Component({
  selector: 'app-search-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    MatInputModule,
    MatOptionModule,
    CommonModule,
    WeatherresultsComponent
  ],
  templateUrl: './search-form.component.html',
  styleUrl: './search-form.component.css'
})
export class SearchFormComponent implements OnInit {
  form: FormGroup= new FormGroup({});
  constructor(private citysearchService: CitysearchService, private cdr: ChangeDetectorRef) {
    this.form = new FormGroup({
      cityFieldControl: new FormControl('', [this.validator()]),
      stateFieldControl: new FormControl('', [this.validator()]),
      streetFieldControl: new FormControl('', [this.validator()]),
      autoDetectControl: new FormControl(false)
    });
  }
  
  suggestions: any[] = [];
  currentTab: string = "results";
  weatherDataReady = false;
  favs: any;

  fetching = false;
  progress = 0;

  validator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const invalid_field = (control.value || '').trim().length === 0;
      return invalid_field ? { error: true } : null;
    };
  }

  submitted = false;
  errorOccured = false;

  dailydata: any;
  hourlydata: any;

  currentTemp!: number;
  weatherCondition!: string;
  weatherIcon!: string;
  humidity!: string;
  pressure!: string;
  windSpeed!: string;
  visibility!: string;
  cloudCover!: string;
  uvIndex!: number;
  location!: string;

  latitude!: string;
  longitude!: string;

  ngOnInit(): void {

    this.form.get('autoDetectControl')!.valueChanges.subscribe((checked) => {
      if (checked) {
        this.form.get('cityFieldControl')!.disable();
        this.form.get('stateFieldControl')!.disable();
        this.form.get('streetFieldControl')!.disable();
      } else {
        this.form.get('cityFieldControl')!.enable();
        this.form.get('stateFieldControl')!.enable();
        this.form.get('streetFieldControl')!.enable();
      }
    });

    this.form.get('cityFieldControl')!.valueChanges
      .pipe(debounceTime(300),distinctUntilChanged(),switchMap((input) => {
          if (input) {
            return this.citysearchService.getCitySuggestions(input); 
          } else {
            return of([]); 
          }
        })
      )
      .subscribe(
        (suggestions) => {
          this.suggestions = suggestions; 
        }
      );
    this.handleFavsClick();
    
  }

  isFavorite: boolean = false;

  toggleFavorite(event: { isFavorite: any; city: any; state: any; latitude: any; longitude: any }) {
    const { isFavorite, city, state, latitude, longitude } = event;

      this.isFavorite = isFavorite;
      if (isFavorite) {
        this.favs.push({ city, state, latitude, longitude });
      } else {
        const index = this.favs.findIndex((fav: { city: string }) => fav.city === city);

        if (index > -1) {
          this.favs.splice(index, 1);
        }
      }
  }

  stateMapping: { [key: string]: string } = {
    "AL": "Alabama", "AK": "Alaska", "AZ": "Arizona", "AR": "Arkansas", "CA": "California", "CO": "Colorado", "CT": "Connecticut", "DE": "Delaware", "FL": "Florida", "GA": "Georgia","HI": "Hawaii", "ID": "Idaho", 
    "IL": "Illinois", "IN": "Indiana", "IA": "Iowa","KS": "Kansas", "KY": "Kentucky", "LA": "Louisiana", "ME": "Maine", "MD": "Maryland", "MA": "Massachusetts", "MI": "Michigan", "MN": "Minnesota", "MS": "Mississippi",
    "MO": "Missouri", "MT": "Montana", "NE": "Nebraska", "NV": "Nevada", "NH": "New Hampshire", "NJ": "New Jersey", "NM": "New Mexico", "NY": "New York", "NC": "North Carolina","ND": "North Dakota", 
    "OH": "Ohio", "OK": "Oklahoma", "OR": "Oregon", "PA": "Pennsylvania", "RI": "Rhode Island", "SC": "South Carolina", "SD": "South Dakota", "TN": "Tennessee","TX": "Texas", "UT": "Utah", "VT": "Vermont", 
    "VA": "Virginia", "WA": "Washington", "WV": "West Virginia", "WI": "Wisconsin", "WY": "Wyoming"
  };

  async handleSubmit(event: any){
    this.isFavorite = false;
    event.preventDefault();
    this.startFetch();
    const google_api_key="AIzaSyCKKdlyDWTm4WnlYaX8zoMs0g3dVoMsyc8";
    if(this.form.get('autoDetectControl')?.value){
      const ip_access_token = "baabb679471b9e";
      const ipresponse = await fetch(`https://ipinfo.io/json?token=${ip_access_token}`, {method: 'get'});
      const ipinfo = await ipresponse.json();
      const formatted_address = ipinfo["city"] + ", " + ipinfo["region"];
      const location = ipinfo["loc"].split(",");
      const latitude = location[0];
      const longitude = location[1];
      this.latitude = latitude;
      this.longitude = longitude;
      let coordinates = new URLSearchParams({lat: latitude, long: longitude});
      let exists = await fetch(`/checkfavs?lat=${latitude}&long=${longitude}`, {method: 'get'});
      let exists1 = await exists.json();
      exists1 = exists1["exists"] ;  
      if(exists1){
        this.isFavorite = true;
      }
      console.log(`exists${exists}`);
      const weatherresponse = await fetch(`/fetchweatherdata?lat=${latitude}&long=${longitude}`, {method: 'get'});
      if (weatherresponse.status === 429) {
        this.errorOccured = true;
        this.completeFetch();
      }else{
        this.incrementProgress(70);
        const weatherdata = await weatherresponse.json();
        this.dailydata = weatherdata["daily_data"];
        this.hourlydata = weatherdata["hourly_data"];
        this.completeFetch()
        setTimeout(()=>{this.weatherDataReady = true;},200)
        this.location = formatted_address;
      }
    }else{
      try{
      let street = this.form.get("streetFieldControl")?.value;
      let city = this.form.get("cityFieldControl")?.value;
      let state = this.form.get("stateFieldControl")?.value;
      let clientdata = {street: street, city: city, state: state};
      let address = street+", "+city+", "+state;
      let URLaddress = encodeURIComponent(address);
      const googleresponse = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${URLaddress}&key=${google_api_key}`, {method: 'get'});

      const geodata = await googleresponse.json();
      if (!geodata.results || geodata.results.length === 0) {
        throw new Error("Invalid address");
      }
      const formatted_address = geodata["results"]["0"]["formatted_address"];
      const location = geodata["results"]["0"]["geometry"]["location"];
      const latitude = location["lat"];
      const longitude = location["lng"];
      this.latitude = latitude;
      this.longitude = longitude;
      let coordinates = new URLSearchParams({lat: latitude, long: longitude});
      let exists = await fetch(`/checkfavs?lat=${latitude}&long=${longitude}`, {method: 'get'});
      let exists1 = await exists.json();
      exists1 = exists1["exists"] ;  
      if(exists1){
        this.isFavorite = true;
      }
      const weatherresponse = await fetch(`/fetchweatherdata?lat=${latitude}&long=${longitude}`, {method: 'get'});
      if (weatherresponse.status === 429) {
        this.errorOccured = true;
        throw new Error("Rate limit exceeded. Please try again later.");
      }
      this.incrementProgress(70);
      const weatherdata = await weatherresponse.json();
      this.dailydata = weatherdata["daily_data"];
      this.hourlydata = weatherdata["hourly_data"];
      this.completeFetch()
      setTimeout(()=>{this.weatherDataReady = true;},200)
      this.location = city + ", " + this.stateMapping[state];
      }catch(error){
        this.completeFetch()
        this.weatherDataReady = false;
        this.errorOccured = true;
      }
    }

  }

  async handleFavsClick(){
    
    const favorites = await fetch(`/getfavorites`, {method: 'get'});
    const data = await favorites.json();
    this.favs = data;
    
  }

  async handleFavsDelete(city: any, state: any, favId: string){
    const index = this.favs.findIndex((fav: { _id: string }) => fav._id === favId);

    if (index > -1) {
      this.favs.splice(index, 1);
    }
    const delfav = await fetch(`/deletefavorite?city=${city}&state=${state}`, {method: 'delete'});
    
    this.handleFavsClick();


    this.cdr.detectChanges();
  }


  
  handleCitySelect(event: any) {
    const selectedPlace = this.suggestions.find(
      (place) => place.city === event.option.value
    );
    if (selectedPlace) {
      this.form.get('stateFieldControl')?.setValue(selectedPlace.state); 
    }
  }


  handleClear(): void {
    this.form.reset({
      cityFieldControl: '',
      stateFieldControl: '',
      streetFieldControl: '',
      autoDetectControl: false
    });

    this.currentTab = "results";
    this.weatherDataReady = false;
    this.errorOccured = false;
    this.isFavorite = false;
  }

  startFetch() {
    this.fetching = true;
    this.progress = 0;
    this.incrementProgress(20);
  }

  incrementProgress(targetProgress: number) {
    const Interval = setInterval(() => {
      if (this.progress < targetProgress) {
        this.progress += 20; 
      } else {
        clearInterval(Interval);
      }}, 100); 
  }

  completeFetch() {
    this.progress = 100;
    setTimeout(() => {this.fetching = false; }, 200); 
  }

  async handleFavListClick(city: any, state: any, lat: any, long: any){
    this.isFavorite = true;
    this.latitude = lat;
    this.longitude = long;
    this.currentTab = "results";
    this.startFetch();
    const weatherresponse = await fetch(`/fetchweatherdata?lat=${lat}&long=${long}`, {method: 'get'});
    this.incrementProgress(70);
    const weatherdata = await weatherresponse.json();
    this.dailydata = weatherdata["daily_data"];
    this.hourlydata = weatherdata["hourly_data"];
    this.completeFetch();
    setTimeout(()=>{this.weatherDataReady = true;},200);
    this.location = city + ", " + state;
  }
}



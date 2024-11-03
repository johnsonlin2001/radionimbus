import { Component, OnInit } from '@angular/core';
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
  ],
  templateUrl: './search-form.component.html',
  styleUrl: './search-form.component.css'
})
export class SearchFormComponent implements OnInit {
  form: FormGroup= new FormGroup({});
  constructor(private citysearchService: CitysearchService) {
    this.form = new FormGroup({
      cityFieldControl: new FormControl('', [this.validator()]),
      stateFieldControl: new FormControl('', [this.validator()]),
      streetFieldControl: new FormControl('', [this.validator()]),
      autoDetectControl: new FormControl(false)
    });
  }
  
  suggestions: any[] = [];

  validator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const invalid = (control.value || '').trim().length === 0;
      return invalid ? { val_error: true } : null;
    };
  }

  submitted = false;

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
      .pipe(
        debounceTime(500),              
        distinctUntilChanged(),         
        switchMap((input) => {
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
        },
        (error) => {
          console.error('Error fetching city suggestions:', error);
        }
      );
  }

  async handleSubmit(event: any){
    event.preventDefault();
    const google_api_key="AIzaSyCKKdlyDWTm4WnlYaX8zoMs0g3dVoMsyc8";
    if(this.form.get('autoDetectControl')?.value){
      const ip_access_token = "baabb679471b9e";
      const ipresponse = await fetch(`https://ipinfo.io/json?token=${ip_access_token}`, {method: 'get'});
      const ipinfo = await ipresponse.json();
      const formatted_address = ipinfo["city"] + ", " + ipinfo["region"] + ", " + ipinfo["country"];
      const location = ipinfo["loc"].split(",");
      const latitude = location[0];
      const longitude = location[1];
      let coordinates = new URLSearchParams({lat: latitude, long: longitude});
    }else{
      let street = this.form.get("streetFieldControl")?.value;
      let city = this.form.get("cityFieldControl")?.value;
      let state = this.form.get("stateFieldControl")?.value;
      let clientdata = {street: street, city: city, state: state};
      let address = street+", "+city+", "+state;
      let URLaddress = encodeURIComponent(address);
      const googleresponse = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${URLaddress}&key=${google_api_key}`, {method: 'get'});

      const geodata = await googleresponse.json();
      const formatted_address = geodata["results"]["0"]["formatted_address"];
      const location = geodata["results"]["0"]["geometry"]["location"];
      const latitude = location["lat"];
      const longitude = location["lng"];
      let coordinates = new URLSearchParams({lat: latitude, long: longitude});
      console.log(latitude);
      console.log(longitude);
    }

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
  }
}

import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CitysearchService {

  constructor() { }

  getCitySuggestions(query: string): Promise<any> {
    return fetch(`/places?input=${encodeURIComponent(query)}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network error');
        }
        return response.json();
      });
  }
}

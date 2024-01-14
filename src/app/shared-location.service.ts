import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SharedLocationService {
  private locations: Array<{ name: string, lat: number, lng: number }> = [];

  addLocation(location: { name: string, lat: number, lng: number }) {
    try {
      const response = fetch('https://272.selfip.net/apps/4cLJLGCZqy/collections/location/documents/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          key: `${location.name}`,
          data: JSON.stringify(location)
        })
      });
    } catch (error) {
      console.error('Error creating location:', error);
    }  }

  async getLocations() {
    try {
      const response = await fetch('https://272.selfip.net/apps/4cLJLGCZqy/collections/location/documents/', {
        method: 'GET',
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching documents:', error);
      return [];
    }
  }
}

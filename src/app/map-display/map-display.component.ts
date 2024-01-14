import { Component, AfterViewInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import * as L from 'leaflet';
import { Injectable } from '@angular/core';

import { icon, Marker } from 'leaflet';
const iconRetinaUrl = '../assets/marker-icon-2x.png';
const iconUrl = '../assets/marker-icon.png';
const shadowUrl = '../assets/marker-shadow.png';
const iconDefault = icon({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41]
})

Marker.prototype.options.icon = iconDefault;

@Injectable({
  providedIn: 'root'

})
export class locationService {

  async createLocation(location: any) {
    try {
      const response = await fetch('https://272.selfip.net/apps/4cLJLGCZqy/collections/location/documents/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          key: `${location.name}`,
          data: JSON.stringify(location)
        })
      });
      return await response.json();
    } catch (error) {
      console.error('Error creating location:', error);
    }
  }

  async getLocations() {
    try {
      const response = await fetch('https://272.selfip.net/apps/4cLJLGCZqy/collections/location/documents/', {
        method: 'GET',
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching locations:', error);
      return [];
    }
  }

}

@Component({
  selector: 'app-map-display',
  standalone: true,
  imports: [],
  templateUrl: './map-display.component.html',
  styleUrls: ['./map-display.component.css']
})
export class MapDisplayComponent implements AfterViewInit, OnChanges {
  @Input() locations: Array<{ name: string, lat: number, lng: number }> = [];
  @Input() selectedLocationData: any;
  constructor(
    private locationService: locationService,
  ) { }
  private map: L.Map | undefined;

  ngAfterViewInit(): void {
    this.map = L.map('map').setView([49.2, -123], 11);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      attribution: '&copy; OpenStreetMap contributors',
      tileSize: 512,
      zoomOffset: -1
    }).addTo(this.map);

    this.addSavedMarkers();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedLocationData'] && this.selectedLocationData) {
      // Handle changes to selectedLocationData here if needed
    }
  }


  private async addSavedMarkers(): Promise<void> {
    if (this.map) {
      const locations2 = await this.locationService.getLocations();

      locations2.forEach((location) => {
        const parsedData = JSON.parse(location.data);
        const lat = parsedData.latitude || parsedData.lat;
        const lng = parsedData.longitude || parsedData.lng;

        if (lat !== undefined && lng !== undefined) {
          L.marker([lat, lng]).addTo(this.map)
            .bindPopup(`<b>${parsedData.name}</b><br />cases reported.`).openPopup();
        }
      });
    }
  }

}

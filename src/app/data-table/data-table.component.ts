import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SharedLocationService } from '../shared-location.service'; 
import { Injectable} from '@angular/core';
import { Md5 } from 'ts-md5';
@Injectable({
  providedIn: 'root'

})

export class StorageService {


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


  async createDocument(report: any) {
    try {
      const response = await fetch('https://272.selfip.net/apps/4cLJLGCZqy/collections/reports/documents/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', 
        },
        body: JSON.stringify({
          key: `report_${report.id}`,
          data: JSON.stringify(report)
        })
      });

      return await response.json();
    } catch (error) {
      console.error('Error creating document:', error);
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

  async getAllDocuments() {
    try {
      const response = await fetch('https://272.selfip.net/apps/4cLJLGCZqy/collections/reports/documents/', {
        method: 'GET',
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching documents:', error);
      return [];
    }
  }

  async deleteDocument(reportId: number) {
    try {
      await fetch(`https://272.selfip.net/apps/4cLJLGCZqy/collections/reports/documents/report_${reportId}/`, {
        method: 'DELETE',
      });
      console.log('Document deleted');
    } catch (error) {
      console.error('Error deleting document:', error);
    }
  }


}

@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.css']
})
export class DataTableComponent {

  reports = [
  ];

  locationOption: 'new' | 'existing' = 'new';
  selectedLocation: string = '';
  newLocationName: string = ''; 
  newLocationLat!: number;
  newLocationLng!: number;

  newReport = {
    reporter: null,
    reporterPhone: null,
    troublemakerName: null,
    location: null,
    latitude: null,
    longitude: null,
    pictureUrl: null,
    extraInfo: null,
    timeDate: new Date(),
    status: 'Open'
  };

  constructor(
    private locationService: SharedLocationService,
    private storageService: StorageService
  ) { }
  selectedReport: any = null;
  showMoreInfo(report: any): void {
    if (this.selectedReport === report) {
      this.selectedReport = null; 
    } else {
      this.selectedReport = report; 
    }
  }


  showAddReportForm = false;
  async addReport(): Promise<void> {
    const locations = this.loadLocationData();

    let reportLocation = 'Saved Location';
    let latitude = 49.2827;
    let longitude = 123.1207;

    if (this.locationOption === 'new') {

      const newLocation = {
        name: this.newLocationName,
        latitude: this.newLocationLat || 40,
        longitude: this.newLocationLng || -74,
      };

      console.log(newLocation);
      const createdLocation = await this.storageService.createLocation(newLocation);
      reportLocation = createdLocation.name;

    }
    else if (this.locationOption === 'existing') {
      reportLocation = this.selectedLocation;
    }

    const newReport = {
      ...this.newReport,
      id: this.reports.length + 1,
      location: reportLocation,
      latitude: latitude,
      longitude: longitude,
      timeDate: new Date()
    };

    this.reports.push(newReport);
    try {
      await this.storageService.createDocument(newReport);
      console.log('Report added to storage');
    } catch (error) {
      console.error('Error storing the new report:', error);
    }
    this.resetNewReportForm();

  }
  async deleteReport(reportId: number): Promise<void> {
    let enteredPassword: string | null = '';

    while (enteredPassword?.trim() === '') {
      enteredPassword = window.prompt('Please enter the password:');

      if (enteredPassword === null) {
        alert('Action canceled.');
        return;
      }
    }
    let new_md5 = new Md5();
    const enteredPasswordHash = new_md5.appendStr(enteredPassword).end().toString();
    console.log(enteredPasswordHash);
    if (enteredPasswordHash === 'fcab0453879a2b2281bc5073e3f5fe54') {
      if (window.confirm('Are you sure you want to delete this report?')) {
        this.reports = this.reports.filter(report => report.id !== reportId);

        try {
          await this.storageService.deleteDocument(reportId);
          console.log('Report deleted from storage');
          alert('Report deleted successfully.');
        } catch (error) {
          console.error('Error deleting the report:', error);
          alert('Error deleting the report.');
        }
      } else {
        alert('Action canceled.');
      }
    } else {
      alert('Incorrect password. Action canceled.');
    }
  }

  selectedLocationData: any;
  async loadLocationData(): Promise<void> {
    if (this.selectedLocation) {
      const allLocations = await this.storageService.getLocations();

      console.log('Selected Location Key:', this.selectedLocation);
      console.log('All Locations:', allLocations);

      const selectedLocationData = allLocations.find(location => {
        const parsedData = JSON.parse(location.data); // Parse the JSON data
        return parsedData.name === this.selectedLocation;
      });

      console.log('Found Location:', selectedLocationData);

      if (selectedLocationData) {
        this.selectedLocationData = JSON.parse(selectedLocationData.data); // Parse the JSON data
        this.newReport.location = selectedLocationData.key;
        this.newReport.latitude = selectedLocationData.latitude || selectedLocationData.lat || 0;
        this.newReport.longitude = selectedLocationData.longitude || selectedLocationData.lng || 0;

        console.log('Selected Location Data:', this.selectedLocationData);
        console.log('Updated newReport:', this.newReport);
      }
    }
  }



  async loadReports(): Promise<void> {
    try {
      const documents = await this.storageService.getAllDocuments();
      this.reports = documents.map(doc => {
        if (typeof doc.data === 'string' && doc.data.trim() !== '') {
          return JSON.parse(doc.data);
        } else {
         return null; 
        }
      }).filter(report => report !== null); 
    } catch (error) {
      console.error('Error loading reports:', error);
    }

  }



  private resetNewReportForm(): void {
    this.newReport = {
      reporter: null,
      reporterPhone: null,
      troublemakerName: null,
      location: '',
      latitude: 49.2827,
      longitude: 123.1207,
      pictureUrl: null,
      extraInfo: null,
      timeDate: new Date(),
      status: 'Open'
    };
    this.showAddReportForm = false;
  }

  savedLocations: string;


  async ngOnInit() {
    this.loadReports();
    this.savedLocations = (await this.storageService.getLocations()).map(location => location.key);
    this.resetNewReportForm();
  }
  sortColumn!: string;
  sortAscending = true;

  toggleSort(column: string): void {
    if (this.sortColumn === column) {
      this.sortAscending = !this.sortAscending;
    } else {
      this.sortAscending = true;
      this.sortColumn = column;
    }
    this.sortReports();
  }
  sortReports(): void {
    this.reports.sort((a, b) => {
      switch (this.sortColumn) {
        case 'Location':
          return this.sortAscending
            ? a.location.localeCompare(b.location)
            : b.location.localeCompare(a.location);
        case 'Reporter':
          return this.sortAscending
            ? a.reporter.localeCompare(b.reporter)
            : b.reporter.localeCompare(a.reporter);
        case 'Time Reported':
          const timeDateA = a.timeDate instanceof Date ? a.timeDate.getTime() : 0;
          const timeDateB = b.timeDate instanceof Date ? b.timeDate.getTime() : 0;
          return this.sortAscending ? timeDateA - timeDateB : timeDateB - timeDateA;
        case 'Status':
          return this.sortAscending
            ? a.status.localeCompare(b.status)
            : b.status.localeCompare(a.status);
        default:
          return 0; 
      }
    });
  }



  async changeStatus(report: any): Promise<void> {
    let enteredPassword: string | null = window.prompt('Please enter the password to change status:');

    if (enteredPassword !== null) {
      let new_md5 = new Md5();
      const enteredPasswordHash = new_md5.appendStr(enteredPassword).end().toString();

      if (enteredPasswordHash === 'fcab0453879a2b2281bc5073e3f5fe54') {
        report.status = report.status === 'Open' ? 'Closed' : 'Open';
      } else {
        alert('Incorrect password. Action canceled.');
      }
    } else {
      alert('Action canceled.');
    }

  }
}




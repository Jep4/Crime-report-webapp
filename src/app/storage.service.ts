import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private apiUrl = 'https://272.selfip.net/4cLJLGCZqy/';
  private headers = new HttpHeaders({
    'Application-Key': '4cLJLGCZqy',
    'Secret-Key': 'HOo7WwoHJXPnlD4vUhmVu8nYaCS1cQ'
  });

  constructor(private http: HttpClient) { }

  createDocument(data: any): Observable<any> {
    return this.http.post(this.apiUrl, data, { headers: this.headers });
  }


  private reportsSubject = new BehaviorSubject<any[]>([]);
  reports$ = this.reportsSubject.asObservable();


  deleteDocument(reportId: number) {
    return this.http.delete(`${this.apiUrl}report_${reportId}/`, { headers: this.headers });
  }


  async getAllDocuments() {
    try {
      const response = await fetch('https://272.selfip.net/apps/4cLJLGCZqy/collections/reports/documents/', {
        method: 'GET',
      });
      const data = await response.json();
      return data.documents; 
    } catch (error) {
      console.error('Error fetching documents:', error);
      return [];
    }
  }
}

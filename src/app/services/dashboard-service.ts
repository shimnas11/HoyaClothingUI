import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private apiUrl = environment.apiUrl;
  constructor(private http: HttpClient) { }


  getDashboardData(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/dashboard/getdashboard`);
  }

  getHotSellingProducts(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/dashboard/hotSellingProducts`);
  }

  getExhibitionOverview(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/dashboard/getExhibitionOverview`);
  }
}

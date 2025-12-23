import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { DatePipe } from '@angular/common';
import { Space } from '../models/space.model';

@Injectable({
  providedIn: 'root'
})
export class SpacesService {

  private apiUrl = environment.apiUrl + 'spaces';

  constructor(
    private http: HttpClient,
    private datePipe: DatePipe
  ) {}

  getSpaces(
    type?: string,
    capacity?: string,
    date?: string
  ): Observable<Space[]> {

    let params = new HttpParams();

    if (type) params = params.set('type', type);
    if (capacity) params = params.set('capacity', capacity);

    if (date) {
      const formattedDate = this.datePipe.transform(date, 'yyyy-MM-dd');
      if (formattedDate) {
        params = params.set('date', formattedDate);
      }
    }

    return this.http.get<Space[]>(this.apiUrl, { params });
  }

  getSpaceById(id: number): Observable<Space> {
    return this.http.get<Space>(`${this.apiUrl}/${id}`);
  }

  createSpace(data: FormData): Observable<Space> {
    return this.http.post<Space>(this.apiUrl, data);
  }

  updateSpace(id: number, data: FormData): Observable<Space> {
    return this.http.post<Space>(
      `${this.apiUrl}/${id}?_method=PUT`,
      data
    );
  }

  deleteSpace(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Reservation } from '../models/reservations.model';

@Injectable({
  providedIn: 'root'
})
export class ReservationsService {

  private apiUrl = environment.apiUrl + 'reservations';

  constructor(private http: HttpClient) {}

  getUserReservations(): Observable<Reservation[]> {
    return this.http.get<Reservation[]>(this.apiUrl);
  }

  getReservationById(id: number): Observable<Reservation> {
    return this.http.get<Reservation>(`${this.apiUrl}/${id}`);
  }

  createReservation(
    data: Omit<Reservation, 'id' | 'user_id' | 'created_at' | 'updated_at'>
  ): Observable<Reservation> {
    return this.http.post<Reservation>(this.apiUrl, data);
  }


  updateReservation(
    id: number,
    data: Partial<Omit<Reservation, 'id' | 'created_at' | 'updated_at'>>
  ): Observable<Reservation> {
    return this.http.put<Reservation>(`${this.apiUrl}/${id}`, data);
  }

  deleteReservation(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getBySpace(spaceId: number): Observable<Reservation[]> {
    return this.http.get<Reservation[]>(
      `${environment.apiUrl}spaces/${spaceId}/reservations`
    );
  }
}

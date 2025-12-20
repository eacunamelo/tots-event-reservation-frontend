import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../core/services/api.service';

export interface Reservation {
  id: number;
  event_name: string;
  start_time: string;
  end_time: string;
  space: {
    id: number;
    name: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class ReservationService {

  constructor(private api: ApiService) {}

  getAll(): Observable<Reservation[]> {
    return this.api.get<Reservation[]>('/reservations');
  }

  delete(id: number): Observable<void> {
    return this.api.delete<void>(`/reservations/${id}`);
  }
}

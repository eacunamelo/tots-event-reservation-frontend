import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { ReservationsService } from '../../../../reservations/services/reservation.service';
import { Reservation } from '../../../../reservations/models/reservations.model';
import { NotificationService } from '../../../../core/services/notification.service';

interface AgendaSlot {
  start: string;
  end: string;
  isOccupied: boolean;
}

@Component({
  standalone: true,
  selector: 'app-space-agenda',
  imports: [CommonModule],
  templateUrl: './space-agenda.html',
  styleUrls: ['./space-agenda.css']
})
export class SpaceAgendaComponent implements OnChanges {

  @Input({ required: true }) spaceId!: number;
  @Input({ required: true }) date!: string; // YYYY-MM-DD

  slots$!: Observable<AgendaSlot[]>;

  constructor(
    private reservationsService: ReservationsService,
    private notification: NotificationService
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (this.spaceId && this.date) {
      this.loadAgenda();
    }
  }

  private loadAgenda(): void {
    this.slots$ = this.reservationsService.getBySpace(this.spaceId).pipe(
      map(reservations => this.buildSlots(reservations)),
      catchError(() => {
        this.notification.showError('No se pudo cargar la agenda');
        return of([]);
      })
    );
  }

  private buildSlots(reservations: Reservation[]): AgendaSlot[] {
    const slots: AgendaSlot[] = [];

    for (let hour = 8; hour < 22; hour++) {
      const start = `${this.date}T${this.pad(hour)}:00`;
      const end   = `${this.date}T${this.pad(hour + 1)}:00`;

      const slotStart = new Date(start);
      const slotEnd   = new Date(end);

      const isOccupied = reservations.some(r =>
        this.overlaps(slotStart, slotEnd, r)
      );

      slots.push({
        start: start.slice(11, 16),
        end: end.slice(11, 16),
        isOccupied
      });
    }

    return slots;
  }

  private overlaps(slotStart: Date, slotEnd: Date, r: Reservation): boolean {
    const resStart = new Date(r.start_time);
    let resEnd = new Date(r.end_time);

    // Corrige casos tipo 23:11 – 23:11
    if (resEnd.getTime() <= resStart.getTime()) {
      resEnd = new Date(resStart.getTime() + 60_000);
    }

    return slotStart < resEnd && slotEnd > resStart;
  }

  private pad(n: number): string {
    return n.toString().padStart(2, '0');
  }
}

import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { ReservationsService } from '../../../../reservations/services/reservation.service';
import { Reservation } from '../../../../reservations/models/reservations.model';
import { NotificationService } from '../../../../core/services/notification.service';

interface CalendarDay {
  date: string;
  dayNumber: number;
  isReserved: boolean;
}

@Component({
  standalone: true,
  selector: 'app-space-calendar',
  imports: [CommonModule],
  templateUrl: './space-calendar.html',
  styleUrls: ['./space-calendar.css']
})
export class SpaceCalendarComponent implements OnChanges {

  @Input({ required: true }) spaceId!: number;
  @Output() daySelected = new EventEmitter<string>();

  days$!: Observable<CalendarDay[]>;

  month!: number;
  year!: number;

  constructor(
    private reservationsService: ReservationsService,
    private notification: NotificationService
  ) {
    const now = new Date();
    this.month = now.getMonth();
    this.year = now.getFullYear();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['spaceId'] && this.spaceId) {
      this.loadMonth();
    }
  }

  prevMonth(): void {
    if (this.month === 0) {
      this.month = 11;
      this.year--;
    } else {
      this.month--;
    }
    this.loadMonth();
  }

  nextMonth(): void {
    if (this.month === 11) {
      this.month = 0;
      this.year++;
    } else {
      this.month++;
    }
    this.loadMonth();
  }

  private loadMonth(): void {
    this.days$ = this.reservationsService.getBySpace(this.spaceId).pipe(
      map(reservations => this.buildMonth(reservations)),
      catchError(() => {
        this.notification.showError('No se pudo cargar el calendario');
        return of([]);
      })
    );
  }

  private buildMonth(reservations: Reservation[]): CalendarDay[] {
    const days: CalendarDay[] = [];
    const totalDays = new Date(this.year, this.month + 1, 0).getDate();

    for (let d = 1; d <= totalDays; d++) {
      const iso = this.toISODateLocal(this.year, this.month + 1, d);

      const isReserved = reservations.some(r => {
        const startIso = this.toISOFromDateTime(r.start_time);
        const endIso   = this.toISOFromDateTime(r.end_time);

        const start = this.parseLocalDateTime(r.start_time);
        let end = this.parseLocalDateTime(r.end_time);
        if (end.getTime() <= start.getTime()) {
          end = new Date(start.getTime() + 60_000);
        }

        const dayStart = new Date(`${iso}T00:00:00`);
        const dayEnd   = new Date(`${iso}T23:59:59`);
        return start < dayEnd && end > dayStart;
      });

      days.push({
        date: iso,
        dayNumber: d,
        isReserved
      });
    }
    return days;
  }

  private toISODateLocal(y: number, m: number, d: number): string {
    const mm = String(m).padStart(2, '0');
    const dd = String(d).padStart(2, '0');
    return `${y}-${mm}-${dd}`;
  }

  private parseLocalDateTime(value: string): Date {
    return new Date(value);
  }

  private toISOFromDateTime(value: string): string {
    const dt = this.parseLocalDateTime(value);
    const y = dt.getFullYear();
    const m = String(dt.getMonth() + 1).padStart(2, '0');
    const d = String(dt.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }

  selectDay(day: CalendarDay): void {
    this.daySelected.emit(day.date);
  }
}

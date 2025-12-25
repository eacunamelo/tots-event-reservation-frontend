import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { catchError, finalize, tap, startWith } from 'rxjs/operators';

import { ReservationsService } from '../../services/reservation.service';
import { Reservation } from '../../models/reservations.model';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  standalone: true,
  selector: 'app-reservations-page',
  imports: [CommonModule],
  templateUrl: './reservations-page.html',
  styleUrls: ['./reservations-page.css']
})
export class ReservationsPage implements OnInit {

  reservations$!: Observable<Reservation[]>;
  isLoading$ = new BehaviorSubject<boolean>(true);

  deletingId: number | null = null;

  constructor(
    private reservationService: ReservationsService,
    private notification: NotificationService
  ) {}

  ngOnInit(): void {
    this.reservations$ = this.reservationService.getUserReservations().pipe(
      tap(() => this.isLoading$.next(true)),
      catchError(() => {
        this.notification.showError('No se pudieron cargar las reservas');
        return of([]);
      }),
      finalize(() => this.isLoading$.next(false)),
      startWith([])
    );
  }

  confirmDelete(id: number): void {
    this.deletingId = id;
  }

  cancelDelete(): void {
    this.deletingId = null;
  }

  deleteReservation(): void {
    if (!this.deletingId) return;

    const id = this.deletingId;
    this.isLoading$.next(true);

    this.reservationService.deleteReservation(id).subscribe({
      next: () => {
        this.notification.showSuccess('La reserva fue cancelada correctamente');
        this.deletingId = null;
        this.ngOnInit();
      },
      error: () => {
        this.notification.showError('No se pudo cancelar la reserva');
        this.deletingId = null;
        this.isLoading$.next(false);
      }
    });
  }
}

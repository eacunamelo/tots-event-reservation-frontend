import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable, of, defer } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';

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

  isLoading = false;
  deletingId: number | null = null;

  constructor(
    private reservationService: ReservationsService,
    private notification: NotificationService
  ) {}

  ngOnInit(): void {
    this.loadReservations();
  }

  private buildReservationsStream(): Observable<Reservation[]> {
    return defer(() => {
      this.isLoading = true;

      return this.reservationService.getUserReservations().pipe(
        catchError(() => {
          this.notification.showError(
            'No se pudieron cargar las reservas'
          );
          return of([] as Reservation[]);
        }),
        finalize(() => {
          this.isLoading = false;
        })
      );
    });
  }

  loadReservations(): void {
    this.reservations$ = this.buildReservationsStream();
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

    this.reservationService.deleteReservation(id).subscribe({
      next: () => {
        this.notification.showSuccess(
          'La reserva fue cancelada correctamente'
        );
        this.deletingId = null;
        this.loadReservations();
      },
      error: () => {
        this.notification.showError(
          'No se pudo cancelar la reserva'
        );
        this.deletingId = null;
      }
    });
  }
}

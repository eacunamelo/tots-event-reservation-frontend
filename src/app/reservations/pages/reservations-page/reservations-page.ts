import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';

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
  loading = true;

  constructor(
    private reservationService: ReservationsService,
    private notification: NotificationService
  ) {}

  ngOnInit(): void {
    this.loadReservations();
  }

  loadReservations(): void {
    this.reservations$ = this.reservationService.getUserReservations();
    this.loading = false;
  }

  deleteReservation(id: number): void {
    this.notification.showWarn(
      '¿Deseas cancelar esta reserva?',
      'Confirmación requerida'
    );

    if (!confirm('Esta acción no se puede deshacer')) return;

    this.reservationService.deleteReservation(id).subscribe({
      next: () => {
        this.notification.showSuccess(
          'La reserva fue cancelada correctamente'
        );
        this.loadReservations();
      },
      error: () => {
        this.notification.showError(
          'No se pudo cancelar la reserva'
        );
      }
    });
  }
}

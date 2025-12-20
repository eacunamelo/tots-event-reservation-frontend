import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReservationService, Reservation } from '../../services/reservation.service';

@Component({
  standalone: true,
  selector: 'app-reservations-page',
  imports: [CommonModule],
  templateUrl: './reservations-page.html',
  styleUrls: ['./reservations-page.css']
})
export class ReservationsPage implements OnInit {

  reservations: Reservation[] = [];
  loading = true;

  constructor(private reservationService: ReservationService) {}

  ngOnInit(): void {
    this.loadReservations();
  }

  loadReservations() {
    this.reservationService.getAll().subscribe({
      next: res => {
        this.reservations = res;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  deleteReservation(id: number) {
    if (!confirm('¿Eliminar reserva?')) return;

    this.reservationService.delete(id).subscribe(() => {
      this.reservations = this.reservations.filter(r => r.id !== id);
    });
  }
}

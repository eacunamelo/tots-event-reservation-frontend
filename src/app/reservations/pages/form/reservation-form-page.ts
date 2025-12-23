import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import { Observable } from 'rxjs';

import { Space } from '../../../space/models/space.model';
import { Reservation, CreateReservationDTO } from '../../models/reservations.model';

import { SpacesService } from '../../../space/services/space.service';
import { ReservationsService } from '../../services/reservation.service';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  standalone: true,
  selector: 'app-reservation-form-page',
  templateUrl: './reservation-form-page.html',
  styleUrls: ['./reservation-form-page.css'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DatePipe
  ]
})
export class ReservationFormPage implements OnInit {

  reservationForm!: FormGroup;

  spaceId!: number;
  space$!: Observable<Space>;
  reservedSlots: Reservation[] = [];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private spacesService: SpacesService,
    private reservationsService: ReservationsService,
    private router: Router,
    private notification: NotificationService
  ) {}

  ngOnInit(): void {
    const paramId = this.route.snapshot.paramMap.get('spaceId');

    if (!paramId) {
      this.notification.showError('Espacio no válido');
      this.router.navigate(['/spaces']);
      return;
    }

    this.spaceId = Number(paramId);

    this.reservationForm = this.fb.group({
      event_name: ['', Validators.required],
      start_time: ['', Validators.required],
      end_time: ['', Validators.required]
    });

    this.space$ = this.spacesService.getSpaceById(this.spaceId);
    this.loadReservations();
  }

  private loadReservations(): void {
    this.reservationsService
      .getBySpace(this.spaceId)
      .subscribe({
        next: (res) => this.reservedSlots = res,
        error: () => {
          this.notification.showError(
            'No se pudieron cargar los horarios ocupados'
          );
        }
      });
  }

  submit(): void {
    if (this.reservationForm.invalid) {
      this.notification.showWarn(
        'Completa todos los campos obligatorios',
        'Formulario incompleto'
      );
      return;
    }

    const payload: CreateReservationDTO = {
      space_id: this.spaceId,
      event_name: this.reservationForm.value.event_name,
      start_time: this.reservationForm.value.start_time,
      end_time: this.reservationForm.value.end_time
    };

    this.reservationsService.createReservation(payload).subscribe({
      next: () => {
        this.notification.showSuccess(
          'La reserva se creó correctamente',
          'Reserva confirmada'
        );
        this.router.navigate(['/reservations']);
      },
      error: (error) => {
        if (error.status === 409) {
          this.notification.showWarn(
            error.error?.message || 'El horario seleccionado ya está ocupado',
            'Horario no disponible'
          );
          return;
        }

        this.notification.showError(
          'Ocurrió un error inesperado al crear la reserva',
          'Error'
        );
      }
    });
  }

  isSlotUnavailable(date: string): boolean {
    return this.reservedSlots.some(
      r => date >= r.start_time && date < r.end_time
    );
  }
}

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import { Observable, of, forkJoin } from 'rxjs';
import { catchError, finalize, map } from 'rxjs/operators';

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
  imports: [CommonModule, ReactiveFormsModule, DatePipe]
})
export class ReservationFormPage implements OnInit {

  reservationForm!: FormGroup;

  spaceId!: number;

  data$!: Observable<{
    space: Space;
    reservations: Reservation[];
  }>;

  isLoading = false;
  isSubmitting = false;

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

    this.loadData();
  }

  private loadData(): void {
    this.isLoading = true;

    this.data$ = forkJoin({
      space: this.spacesService.getSpaceById(this.spaceId),
      reservations: this.reservationsService.getBySpace(this.spaceId)
    }).pipe(
      catchError(() => {
        this.notification.showError('No se pudo cargar la información');
        return of({ space: null as any, reservations: [] });
      }),
      finalize(() => {
        this.isLoading = false;
      })
    );
  }

  submit(): void {
    if (this.reservationForm.invalid) {
      this.reservationForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;

    const payload: CreateReservationDTO = {
      space_id: this.spaceId,
      ...this.reservationForm.value
    };

    this.reservationsService.createReservation(payload)
      .pipe(finalize(() => (this.isSubmitting = false)))
      .subscribe({
        next: () => {
          this.notification.showSuccess('Reserva creada correctamente');
          this.router.navigate(['/reservations']);
        },
        error: () => {
          this.notification.showError('Error al crear la reserva');
        }
      });
  }

  isSlotUnavailable(date: string, reservations: Reservation[]): boolean {
    return reservations.some(
      r => date >= r.start_time && date < r.end_time
    );
  }
}

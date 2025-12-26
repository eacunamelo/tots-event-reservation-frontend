import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Observable, of, forkJoin } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';

import { Space } from '../../../space/models/space.model';
import { Reservation, CreateReservationDTO } from '../../models/reservations.model';

import { SpacesService } from '../../../space/services/space.service';
import { ReservationsService } from '../../services/reservation.service';
import { NotificationService } from '../../../core/services/notification.service';
import { SpaceCalendarComponent } from '../../../space/page/components/space-calendar/space-calendar';
import { SpaceAgendaComponent } from '../../../space/page/components/space-agenda/space-agenda';


@Component({
  standalone: true,
  selector: 'app-reservation-form-page',
  templateUrl: './reservation-form-page.html',
  styleUrls: ['./reservation-form-page.css'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SpaceCalendarComponent,
    SpaceAgendaComponent
  ]
})
export class ReservationFormPage implements OnInit {

  reservationForm!: FormGroup;
  spaceId!: number;

  data$!: Observable<{
    space: Space;
    reservations: Reservation[];
  }>;

  selectedDay: string | null = null;

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
    this.data$ = forkJoin({
      space: this.spacesService.getSpaceById(this.spaceId),
      reservations: this.reservationsService.getBySpace(this.spaceId)
    }).pipe(
      catchError(() => {
        this.notification.showError('No se pudo cargar la información');
        return of({ space: null as any, reservations: [] });
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

  onDaySelected(date: string): void {
    this.selectedDay = date;

    this.reservationForm.patchValue({
      start_time: '',
      end_time: ''
    });
  }

  onSlotSelected(slot: { start: string; end: string }): void {
    this.reservationForm.patchValue({
      start_time: slot.start,
      end_time: slot.end
    });
  }
}

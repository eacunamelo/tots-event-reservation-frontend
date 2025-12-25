import { describe, it, expect, beforeEach, vi } from 'vitest';
import { of } from 'rxjs';

import { ReservationsPage } from './reservations-page';
import { Reservation } from '../../models/reservations.model';

describe('ReservationsPage (logic only)', () => {
  let component: ReservationsPage;

  const mockReservations: Reservation[] = [
    {
      id: 1,
      space_id: 1,
      user_id: 1,
      event_name: 'Reunión',
      start_time: '2025-01-01T10:00:00',
      end_time: '2025-01-01T11:00:00',
      created_at: '',
      updated_at: ''
    }
  ];

  const reservationsServiceMock = {
    getUserReservations: vi.fn(() => of(mockReservations)),
    deleteReservation: vi.fn(() => of(void 0))
  };

  const notificationMock = {
    showError: vi.fn(),
    showSuccess: vi.fn()
  };

  beforeEach(() => {
    component = new ReservationsPage(
      reservationsServiceMock as any,
      notificationMock as any
    );
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should load reservations on init', () => {
    component.ngOnInit();
    expect(reservationsServiceMock.getUserReservations).toHaveBeenCalled();
  });

  it('should set deletingId when confirmDelete is called', () => {
    component.confirmDelete(10);
    expect(component.deletingId).toBe(10);
  });

  it('should reset deletingId when cancelDelete is called', () => {
    component.deletingId = 5;
    component.cancelDelete();
    expect(component.deletingId).toBeNull();
  });
});

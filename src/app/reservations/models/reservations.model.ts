export interface Reservation {
  id: number;
  space_id: number;
  user_id: number;
  start_time: string;
  end_time: string;
  event_name: string;
  created_at: string;
  updated_at: string;
}

export type CreateReservationDTO = Omit<Reservation, 'id' | 'user_id' | 'created_at' | 'updated_at'>;

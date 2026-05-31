export type RoomStatus = "available" | "occupied" | "booked";

export interface Room {
  id: string;
  floor: number;
  position: number;
  status: RoomStatus;
}

export interface HotelState {
  rooms: Room[];
}

export interface BookingResult {
  bookedRooms: Room[];
  travelTime: number;
  floorsSpanned: number[];
  message: string;
}

export interface ErrorResponse {
  error: string;
  code?: string;
}

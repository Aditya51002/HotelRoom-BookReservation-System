export const TOTAL_FLOORS = 10;
export const STANDARD_FLOORS = 9;
export const STANDARD_ROOMS_PER_FLOOR = 10;
export const TOP_FLOOR_ROOMS = 7;
export const MAX_ROOMS_PER_BOOKING = 5;
export const CROSS_FLOOR_CANDIDATE_LIMIT = 30;
export const RANDOM_OCCUPANCY_RATE = 0.45;

export function roomCountForFloor(floor: number): number {
  return floor === TOTAL_FLOORS ? TOP_FLOOR_ROOMS : STANDARD_ROOMS_PER_FLOOR;
}

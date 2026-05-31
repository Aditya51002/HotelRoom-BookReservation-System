import {
  CROSS_FLOOR_CANDIDATE_LIMIT,
  MAX_ROOMS_PER_BOOKING,
  TOTAL_FLOORS,
  roomCountForFloor
} from "./hotelConfig";
import type { Room } from "../types/hotel";

type SearchSuccess = {
  rooms: Room[];
  travelTime: number;
};

type SearchFailure = {
  error: string;
};

function sortRooms(rooms: Room[]): Room[] {
  return [...rooms].sort((a, b) => a.floor - b.floor || a.position - b.position);
}

function roomId(floor: number, position: number): string {
  return `${floor}${String(position).padStart(2, "0")}`;
}

/**
 * Builds the canonical 97-room hotel layout with every room marked available.
 */
export function buildInitialRooms(): Room[] {
  const rooms: Room[] = [];

  for (let floor = 1; floor <= TOTAL_FLOORS; floor += 1) {
    for (let position = 1; position <= roomCountForFloor(floor); position += 1) {
      rooms.push({
        id: roomId(floor, position),
        floor,
        position,
        status: "available"
      });
    }
  }

  return rooms;
}

/**
 * Calculates movement time between two rooms using 1 minute per horizontal
 * room step and 2 minutes per vertical floor step.
 */
export function travelTime(a: Room, b: Room): number {
  const horizontal = Math.abs(a.position - b.position);
  const vertical = Math.abs(a.floor - b.floor) * 2;
  return horizontal + vertical;
}

/**
 * Calculates total travel time across a selected room set by sorting the rooms
 * floor-first and summing the travel between each consecutive pair.
 */
export function totalTravelForSet(rooms: Room[]): number {
  const sortedRooms = sortRooms(rooms);
  return sortedRooms.reduce((total, room, index) => {
    const previousRoom = sortedRooms[index - 1];
    return previousRoom ? total + travelTime(previousRoom, room) : total;
  }, 0);
}

/**
 * Produces all k-sized combinations from an array while preserving source order
 * inside each returned combination.
 */
export function combinations<T>(arr: T[], k: number): T[][] {
  if (k === 0) {
    return [[]];
  }

  if (k < 0 || k > arr.length) {
    return [];
  }

  const result: T[][] = [];

  for (let index = 0; index <= arr.length - k; index += 1) {
    const head = arr[index];
    const tailCombinations = combinations(arr.slice(index + 1), k - 1);

    tailCombinations.forEach((tail) => {
      result.push([head, ...tail]);
    });
  }

  return result;
}

function pickBestCombination(candidates: Room[][]): SearchSuccess | null {
  return candidates.reduce<SearchSuccess | null>((best, candidate) => {
    const travel = totalTravelForSet(candidate);

    if (!best || travel < best.travelTime) {
      return {
        rooms: sortRooms(candidate),
        travelTime: travel
      };
    }

    return best;
  }, null);
}

/**
 * Finds the optimal available room set for a booking request. It first tries
 * every same-floor combination and prefers the lowest floor on ties. If no
 * floor can satisfy the request, it searches cross-floor combinations from the
 * first 30 available rooms sorted by floor and position.
 */
export function findOptimalRooms(allRooms: Room[], count: number): SearchSuccess | SearchFailure {
  if (!Number.isInteger(count) || count < 1 || count > MAX_ROOMS_PER_BOOKING) {
    return { error: `Room count must be an integer between 1 and ${MAX_ROOMS_PER_BOOKING}` };
  }

  const availableRooms = sortRooms(allRooms.filter((room) => room.status === "available"));

  if (availableRooms.length < count) {
    return { error: "Not enough rooms available" };
  }

  let bestSameFloor: SearchSuccess | null = null;

  for (let floor = 1; floor <= TOTAL_FLOORS; floor += 1) {
    const floorRooms = availableRooms.filter((room) => room.floor === floor);

    if (floorRooms.length >= count) {
      const bestForFloor = pickBestCombination(combinations(floorRooms, count));

      if (bestForFloor && (!bestSameFloor || bestForFloor.travelTime < bestSameFloor.travelTime)) {
        bestSameFloor = bestForFloor;
      }
    }
  }

  if (bestSameFloor) {
    return bestSameFloor;
  }

  const crossFloorCandidates = availableRooms.slice(0, CROSS_FLOOR_CANDIDATE_LIMIT);
  const bestCrossFloor = pickBestCombination(combinations(crossFloorCandidates, count));

  if (!bestCrossFloor) {
    return { error: "Not enough rooms available" };
  }

  return bestCrossFloor;
}

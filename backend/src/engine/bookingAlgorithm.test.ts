import { describe, expect, it } from "vitest";
import { buildInitialRooms, findOptimalRooms, totalTravelForSet, travelTime } from "./bookingAlgorithm";
import type { Room } from "../types/hotel";

function occupyRooms(rooms: Room[], ids: string[]): Room[] {
  const occupiedIds = new Set(ids);
  return rooms.map((room) => (occupiedIds.has(room.id) ? { ...room, status: "occupied" } : room));
}

describe("booking algorithm", () => {
  it("builds the 97-room hotel layout", () => {
    const rooms = buildInitialRooms();

    expect(rooms).toHaveLength(97);
    expect(rooms[0]).toMatchObject({ id: "101", floor: 1, position: 1, status: "available" });
    expect(rooms[rooms.length - 1]).toMatchObject({ id: "1007", floor: 10, position: 7, status: "available" });
  });

  it("calculates travel time between rooms", () => {
    const rooms = buildInitialRooms();
    const room101 = rooms.find((room) => room.id === "101");
    const room203 = rooms.find((room) => room.id === "203");

    expect(room101 && room203 ? travelTime(room101, room203) : undefined).toBe(4);
  });

  it("selects the lowest same-floor optimal rooms", () => {
    const result = findOptimalRooms(buildInitialRooms(), 3);

    expect("rooms" in result ? result.rooms.map((room) => room.id) : []).toEqual(["101", "102", "103"]);
    expect("rooms" in result ? result.travelTime : undefined).toBe(2);
  });

  it("finds the best same-floor combination after occupancy", () => {
    const rooms = occupyRooms(buildInitialRooms(), ["101", "102", "103", "104"]);
    const result = findOptimalRooms(rooms, 3);

    expect("rooms" in result ? result.rooms.map((room) => room.id) : []).toEqual(["105", "106", "107"]);
  });

  it("searches cross-floor combinations when no floor can satisfy the booking", () => {
    const availableIds = new Set(["101", "102", "201", "202"]);
    const rooms = buildInitialRooms().map((room) =>
      availableIds.has(room.id) ? room : { ...room, status: "occupied" }
    );
    const result = findOptimalRooms(rooms, 4);

    expect("rooms" in result ? result.rooms.map((room) => room.id) : []).toEqual(["101", "102", "201", "202"]);
    expect("rooms" in result ? totalTravelForSet(result.rooms) : undefined).toBe(5);
  });

  it("returns a clear error when too few rooms are available", () => {
    const availableIds = new Set(["101", "102"]);
    const rooms = buildInitialRooms().map((room) =>
      availableIds.has(room.id) ? room : { ...room, status: "occupied" }
    );
    const result = findOptimalRooms(rooms, 3);

    expect(result).toEqual({ error: "Not enough rooms available" });
  });
});

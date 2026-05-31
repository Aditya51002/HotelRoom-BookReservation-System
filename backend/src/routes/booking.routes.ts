import { Router } from "express";
import type { Request, Response } from "express";
import { z } from "zod";
import { RANDOM_OCCUPANCY_RATE } from "../engine/hotelConfig";
import { buildInitialRooms, findOptimalRooms } from "../engine/bookingAlgorithm";
import { validateBody } from "../middleware/validate";
import type { BookRequest, BookingResult, ErrorResponse, HotelState, Room } from "../types/hotel";

interface HotelStateStore {
  getState: () => HotelState;
  setState: (state: HotelState) => void;
}

const bookSchema = z.object({
  count: z.number().int().min(1).max(5)
});

function uniqueFloors(rooms: Room[]): number[] {
  return [...new Set(rooms.map((room) => room.floor))].sort((a, b) => a - b);
}

function markRoomsBooked(rooms: Room[], roomIds: Set<string>): Room[] {
  return rooms.map((room) => (roomIds.has(room.id) ? { ...room, status: "booked" as const } : room));
}

export function createBookingRouter(store: HotelStateStore): Router {
  const router = Router();

  router.get("/state", (_req: Request, res: Response<HotelState>) => {
    res.json(store.getState());
  });

  router.post(
    "/book",
    validateBody(bookSchema),
    (req: Request<Record<string, never>, BookingResult | ErrorResponse, BookRequest>, res: Response<BookingResult | ErrorResponse>) => {
      const result = findOptimalRooms(store.getState().rooms, req.body.count);

      if ("error" in result) {
        res.status(409).json({ error: result.error, code: "NOT_ENOUGH_ROOMS" });
        return;
      }

      const bookedIds = new Set(result.rooms.map((room) => room.id));
      const updatedRooms = markRoomsBooked(store.getState().rooms, bookedIds);
      store.setState({ rooms: updatedRooms });

      const bookedRooms = updatedRooms.filter((room) => bookedIds.has(room.id));
      res.status(201).json({
        bookedRooms,
        travelTime: result.travelTime,
        floorsSpanned: uniqueFloors(bookedRooms),
        message: `Booked ${bookedRooms.length} room${bookedRooms.length === 1 ? "" : "s"}`
      });
    }
  );

  router.post("/random", (_req: Request, res: Response<HotelState>) => {
    const rooms = store.getState().rooms.map((room) => {
      if (room.status !== "available") {
        return room;
      }

      return Math.random() < RANDOM_OCCUPANCY_RATE ? { ...room, status: "occupied" as const } : room;
    });

    store.setState({ rooms });
    res.json(store.getState());
  });

  router.post("/reset", (_req: Request, res: Response<HotelState>) => {
    store.setState({ rooms: buildInitialRooms() });
    res.json(store.getState());
  });

  return router;
}

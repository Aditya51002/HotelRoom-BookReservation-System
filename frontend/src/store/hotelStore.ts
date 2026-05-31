import { create } from "zustand";
import * as hotelApi from "../api/hotelApi";
import type { Room } from "../types/hotel";

interface HotelStore {
  rooms: Room[];
  roomCount: number;
  lastBooking: Room[];
  lastTravelTime: number;
  floorsSpanned: number[];
  error: string | null;
  isLoading: boolean;
  setRoomCount: (n: number) => void;
  fetchState: () => Promise<void>;
  book: () => Promise<void>;
  random: () => Promise<void>;
  reset: () => Promise<void>;
}

function messageFromError(error: unknown): string {
  return error instanceof Error ? error.message : "Something went wrong";
}

export const useHotelStore = create<HotelStore>((set, get) => ({
  rooms: [],
  roomCount: 1,
  lastBooking: [],
  lastTravelTime: 0,
  floorsSpanned: [],
  error: null,
  isLoading: false,
  setRoomCount: (n) => set({ roomCount: Math.min(5, Math.max(1, n)) }),
  fetchState: async () => {
    set({ isLoading: true, error: null });

    try {
      const state = await hotelApi.getState();
      set({ rooms: state.rooms, isLoading: false });
    } catch (error) {
      set({ error: messageFromError(error), isLoading: false });
    }
  },
  book: async () => {
    set({ isLoading: true, error: null });

    try {
      const result = await hotelApi.book(get().roomCount);
      const bookedIds = new Set(result.bookedRooms.map((room) => room.id));

      set((state) => ({
        rooms: state.rooms.map((room) => (bookedIds.has(room.id) ? { ...room, status: "booked" } : room)),
        lastBooking: result.bookedRooms,
        lastTravelTime: result.travelTime,
        floorsSpanned: result.floorsSpanned,
        isLoading: false
      }));
    } catch (error) {
      set({
        error: messageFromError(error),
        lastBooking: [],
        lastTravelTime: 0,
        floorsSpanned: [],
        isLoading: false
      });
    }
  },
  random: async () => {
    set({ isLoading: true, error: null });

    try {
      const state = await hotelApi.random();
      set({ rooms: state.rooms, isLoading: false });
    } catch (error) {
      set({ error: messageFromError(error), isLoading: false });
    }
  },
  reset: async () => {
    set({ isLoading: true, error: null });

    try {
      const state = await hotelApi.reset();
      set({
        rooms: state.rooms,
        lastBooking: [],
        lastTravelTime: 0,
        floorsSpanned: [],
        error: null,
        isLoading: false
      });
    } catch (error) {
      set({ error: messageFromError(error), isLoading: false });
    }
  }
}));

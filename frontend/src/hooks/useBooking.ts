import { useEffect } from "react";
import { useHotelStore } from "../store/hotelStore";

export function useBooking() {
  const store = useHotelStore();

  useEffect(() => {
    void store.fetchState();
  }, []);

  return store;
}

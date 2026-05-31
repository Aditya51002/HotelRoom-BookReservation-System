import { BookingResult } from "./components/BookingResult";
import { ControlBar } from "./components/ControlBar";
import { HotelGrid } from "./components/HotelGrid";
import { HotelStats } from "./components/HotelStats";
import { useBooking } from "./hooks/useBooking";

export default function App() {
  const {
    rooms,
    roomCount,
    lastBooking,
    lastTravelTime,
    floorsSpanned,
    error,
    isLoading,
    setRoomCount,
    book,
    random,
    reset
  } = useBooking();

  return (
    <main className="min-h-screen bg-paper px-6 py-6 text-ink">
      <div className="mx-auto flex max-w-7xl flex-col gap-5">
        <header className="flex flex-wrap items-end justify-between gap-4 border-b border-slate-300 pb-5">
          <div>
            <p className="font-display text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Reservation Console</p>
            <h1 className="mt-1 font-display text-3xl font-bold text-ink">Hotel Room Reservation</h1>
          </div>
          <div className="font-mono text-sm text-slate-500">97 rooms / 10 floors</div>
        </header>

        <ControlBar
          roomCount={roomCount}
          isLoading={isLoading}
          setRoomCount={setRoomCount}
          onBook={() => void book()}
          onRandom={() => void random()}
          onReset={() => void reset()}
        />

        <div className="flex items-start gap-5 overflow-x-auto pb-3">
          <HotelGrid rooms={rooms} lastBooking={lastBooking} />
          <aside className="flex w-80 shrink-0 flex-col gap-5">
            <BookingResult
              lastBooking={lastBooking}
              lastTravelTime={lastTravelTime}
              floorsSpanned={floorsSpanned}
              error={error}
            />
            <HotelStats rooms={rooms} />
          </aside>
        </div>
      </div>
    </main>
  );
}

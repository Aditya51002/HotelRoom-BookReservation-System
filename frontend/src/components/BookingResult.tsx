import type { Room } from "../types/hotel";

interface BookingResultProps {
  lastBooking: Room[];
  lastTravelTime: number;
  floorsSpanned: number[];
  error: string | null;
}

export function BookingResult({ lastBooking, lastTravelTime, floorsSpanned, error }: BookingResultProps) {
  if (error) {
    return (
      <section className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-600">
        {error}
      </section>
    );
  }

  if (lastBooking.length === 0) {
    return (
      <section className="rounded-lg border border-slate-200 bg-white p-5 text-sm text-slate-500 shadow-panel">
        No rooms booked in this session yet.
      </section>
    );
  }

  return (
    <section className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-panel">
      <div className="bg-ink px-5 py-3 font-display text-xs font-bold tracking-[0.16em] text-gold">
        LAST BOOKING
      </div>
      <div className="space-y-5 p-5">
        <div className="flex flex-wrap gap-2">
          {lastBooking.map((room) => (
            <span key={room.id} className="rounded-full bg-ink px-3 py-1 font-mono text-xs text-gold">
              {room.id}
            </span>
          ))}
        </div>

        <div>
          <div className="font-mono text-5xl text-ink">{lastTravelTime}</div>
          <div className="font-display text-xs uppercase text-slate-500">minutes total travel</div>
        </div>

        <div className="flex flex-wrap gap-2">
          {floorsSpanned.map((floor) => (
            <span key={floor} className="rounded-md border border-slate-300 px-2 py-1 font-mono text-xs text-slate-600">
              F{floor}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

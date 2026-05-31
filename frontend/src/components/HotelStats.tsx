import type { Room, RoomStatus } from "../types/hotel";

interface HotelStatsProps {
  rooms: Room[];
}

function countByStatus(rooms: Room[], status: RoomStatus): number {
  return rooms.filter((room) => room.status === status).length;
}

export function HotelStats({ rooms }: HotelStatsProps) {
  const total = rooms.length;
  const available = countByStatus(rooms, "available");
  const occupied = countByStatus(rooms, "occupied");
  const booked = countByStatus(rooms, "booked");
  const unavailable = occupied + booked;
  const occupancyPercent = total === 0 ? 0 : Math.round((unavailable / total) * 100);

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-panel">
      <h2 className="mb-4 font-display text-base font-semibold text-ink">Hotel Stats</h2>
      <div className="space-y-3 text-sm">
        <StatRow label="Total" value={total} />
        <StatRow label="Available" value={available} />
        <StatRow label="Occupied" value={occupied} />
        <StatRow label="Booked" value={booked} />
      </div>
      <div className="mt-5">
        <div className="mb-2 flex justify-between font-display text-xs uppercase text-slate-500">
          <span>Unavailable</span>
          <span>{occupancyPercent}%</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-slate-200">
          <div className="h-full rounded-full bg-ink transition-all duration-300" style={{ width: `${occupancyPercent}%` }} />
        </div>
      </div>
    </section>
  );
}

function StatRow({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center justify-between border-b border-slate-100 pb-2 last:border-b-0 last:pb-0">
      <span className="text-slate-500">{label}</span>
      <span className="font-mono font-medium text-ink">{value}</span>
    </div>
  );
}

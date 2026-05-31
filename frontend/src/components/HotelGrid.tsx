import { LiftShaft } from "./LiftShaft";
import { RoomCell } from "./RoomCell";
import type { Room } from "../types/hotel";

interface HotelGridProps {
  rooms: Room[];
  lastBooking: Room[];
}

function roomsForFloor(rooms: Room[], floor: number): Room[] {
  return rooms
    .filter((room) => room.floor === floor)
    .sort((a, b) => a.position - b.position);
}

function averageFloor(rooms: Room[]): number | null {
  if (rooms.length === 0) {
    return null;
  }

  return rooms.reduce((total, room) => total + room.floor, 0) / rooms.length;
}

export function HotelGrid({ rooms, lastBooking }: HotelGridProps) {
  const floors = Array.from({ length: 10 }, (_, index) => 10 - index);
  const liftTarget = averageFloor(lastBooking);

  return (
    <section className="min-w-[720px] flex-1 rounded-lg border border-slate-200 bg-white p-5 shadow-panel">
      <div className="mb-4 flex items-center justify-between border-b border-slate-200 pb-3">
        <h2 className="font-display text-base font-semibold text-ink">Room Map</h2>
        <div className="flex items-center gap-4 text-xs text-slate-500">
          <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-mint" />Available</span>
          <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-signal" />Occupied</span>
          <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-gold ring-1 ring-ink" />Booked</span>
        </div>
      </div>

      <div className="flex gap-3">
        <div className="w-7 shrink-0 py-1">
          <LiftShaft targetFloor={liftTarget} />
        </div>

        <div className="flex flex-col">
          {floors.map((floor) => {
            const floorRooms = roomsForFloor(rooms, floor);
            const placeholders = Array.from({ length: 10 - floorRooms.length }, (_, index) => index);

            return (
              <div key={floor} className="flex items-center gap-3 py-1">
                <div className="w-8 font-mono text-xs font-medium text-slate-500">F{floor}</div>
                <div className="grid grid-cols-[repeat(10,50px)] gap-2">
                  {floorRooms.map((room) => (
                    <RoomCell key={room.id} room={room} />
                  ))}
                  {placeholders.map((placeholder) => (
                    <div key={`floor-${floor}-placeholder-${placeholder}`} className="h-[42px] w-[50px] rounded-md border border-dashed border-slate-200 bg-slate-50" />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

import type { Room } from "../types/hotel";

interface RoomCellProps {
  room: Room;
}

const statusClasses = {
  available: "border-slate-300 bg-white text-ink",
  occupied: "border-slate-300 bg-slate-200 text-slate-500",
  booked: "booked-pulse border-gold bg-ink text-gold"
};

const dotClasses = {
  available: "bg-mint",
  occupied: "bg-signal",
  booked: "bg-gold"
};

export function RoomCell({ room }: RoomCellProps) {
  return (
    <div
      className={`flex h-[42px] w-[50px] flex-col items-center justify-center gap-1 rounded-md border text-[9px] transition-all duration-250 ease-out ${statusClasses[room.status]}`}
      title={`${room.id} ${room.status}`}
    >
      <span className="font-mono leading-none">{room.id}</span>
      <span className={`h-1.5 w-1.5 rounded-full ${dotClasses[room.status]}`} />
    </div>
  );
}

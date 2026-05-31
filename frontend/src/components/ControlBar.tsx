import { Dice5, Minus, Plus, RotateCcw } from "lucide-react";

interface ControlBarProps {
  roomCount: number;
  isLoading: boolean;
  setRoomCount: (count: number) => void;
  onBook: () => void;
  onRandom: () => void;
  onReset: () => void;
}

export function ControlBar({ roomCount, isLoading, setRoomCount, onBook, onRandom, onReset }: ControlBarProps) {
  return (
    <section className="flex flex-wrap items-center gap-3 rounded-lg border border-slate-200 bg-white p-4 shadow-panel">
      <div className="flex h-11 items-center overflow-hidden rounded-md border border-slate-300 bg-slate-50">
        <button
          className="flex h-11 w-11 items-center justify-center text-ink transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:text-slate-300"
          type="button"
          title="Decrease rooms"
          disabled={roomCount <= 1 || isLoading}
          onClick={() => setRoomCount(roomCount - 1)}
        >
          <Minus size={17} />
        </button>
        <div className="flex h-11 w-14 items-center justify-center border-x border-slate-300 font-mono text-lg text-ink">
          {roomCount}
        </div>
        <button
          className="flex h-11 w-11 items-center justify-center text-ink transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:text-slate-300"
          type="button"
          title="Increase rooms"
          disabled={roomCount >= 5 || isLoading}
          onClick={() => setRoomCount(roomCount + 1)}
        >
          <Plus size={17} />
        </button>
      </div>

      <button
        className="flex h-11 min-w-36 items-center justify-center gap-2 rounded-md bg-ink px-5 font-display text-sm font-semibold text-gold transition hover:bg-[#252544] disabled:cursor-wait disabled:opacity-70"
        type="button"
        disabled={isLoading}
        onClick={onBook}
      >
        {isLoading ? <span className="spinner" /> : null}
        Book Rooms
      </button>

      <button
        className="flex h-11 items-center justify-center gap-2 rounded-md border border-slate-300 px-4 font-display text-sm font-semibold text-ink transition hover:border-ink hover:bg-slate-100 disabled:cursor-wait disabled:opacity-70"
        type="button"
        disabled={isLoading}
        onClick={onRandom}
      >
        <Dice5 size={17} />
        Random
      </button>

      <button
        className="flex h-11 items-center justify-center gap-2 rounded-md border border-red-300 px-4 font-display text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-wait disabled:opacity-70"
        type="button"
        disabled={isLoading}
        onClick={onReset}
      >
        <RotateCcw size={17} />
        Reset
      </button>
    </section>
  );
}

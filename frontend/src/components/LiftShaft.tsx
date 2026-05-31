interface LiftShaftProps {
  targetFloor: number | null;
}

export function LiftShaft({ targetFloor }: LiftShaftProps) {
  const clampedFloor = Math.min(10, Math.max(1, targetFloor ?? 1));
  const topPercent = ((10 - clampedFloor) / 9) * 100;

  return (
    <div className="relative h-full w-7 rounded-full bg-slate-200" aria-label="Lift shaft">
      <div className="absolute left-1/2 top-0 h-full w-1 -translate-x-1/2 rounded-full bg-slate-300" />
      <div
        className="absolute left-1/2 h-5 w-4 -translate-x-1/2 -translate-y-1/2 rounded bg-ink shadow-md transition-[top] duration-[600ms] ease-[cubic-bezier(0.4,0,0.2,1)]"
        style={{ top: `${topPercent}%` }}
      />
    </div>
  );
}

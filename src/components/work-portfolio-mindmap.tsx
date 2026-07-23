const RADIUS_PERCENT = 34;

export function WorkPortfolioMindMap({
  name,
  items,
}: {
  name: string;
  items: string[];
}) {
  if (items.length === 0) return null;

  const dense = items.length > 6;
  const nodeSizeClass = dense
    ? "h-16 w-16 sm:h-20 sm:w-20"
    : "h-20 w-20 sm:h-24 sm:w-24";
  const nodeTextClass = dense ? "text-[9px] sm:text-[10px]" : "text-[10px] sm:text-[11px]";

  const angleStep = (2 * Math.PI) / items.length;
  const points = items.map((item, i) => {
    const angle = angleStep * i - Math.PI / 2;
    return {
      item,
      x: 50 + RADIUS_PERCENT * Math.cos(angle),
      y: 50 + RADIUS_PERCENT * Math.sin(angle),
    };
  });

  return (
    <div className="relative mx-auto aspect-square w-full max-w-[420px] py-4 sm:max-w-[480px]">
      <svg
        className="absolute inset-0 h-full w-full overflow-visible"
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid meet"
      >
        {points.map((p, i) => {
          const midX = 50 + (p.x - 50) * 0.55;
          const midY = 50 + (p.y - 50) * 0.55;
          return (
            <g key={i}>
              <line
                x1={50}
                y1={50}
                x2={p.x}
                y2={p.y}
                className="stroke-wood-300"
                strokeWidth={0.6}
              />
              <circle cx={midX} cy={midY} r={0.9} className="fill-wood-300" />
            </g>
          );
        })}
      </svg>

      <div className="absolute left-1/2 top-1/2 flex h-24 w-24 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-sage-600 p-2 text-center shadow-md ring-4 ring-wood-50 sm:h-28 sm:w-28">
        <span className="font-display text-xs leading-tight break-words text-white sm:text-sm">
          {name}
        </span>
      </div>

      {points.map((p, i) => (
        <div
          key={i}
          style={{ left: `${p.x}%`, top: `${p.y}%` }}
          title={p.item}
          className={`absolute flex ${nodeSizeClass} -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-wood-600 p-2 text-center shadow-md ring-4 ring-wood-50`}
        >
          <span className={`line-clamp-4 ${nodeTextClass} leading-tight break-words text-white`}>
            {p.item}
          </span>
        </div>
      ))}
    </div>
  );
}

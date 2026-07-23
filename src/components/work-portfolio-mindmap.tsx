const RADIUS_PERCENT = 34;
const CENTER_ASPECT = 196 / 192;
const NODE_IMAGES = [
  "/portfolio-node-sage.png",
  "/portfolio-node-peach.png",
  "/portfolio-node-olive.png",
];
const BRANCH_COLORS = ["#66894c", "#a1794a", "#83603a"];

export function WorkPortfolioMindMap({
  name,
  items,
}: {
  name: string;
  items: string[];
}) {
  if (items.length === 0) return null;

  const dense = items.length > 6;
  const leafSizeClass = dense
    ? "w-[70px] h-[44px] sm:w-[88px] sm:h-[55px]"
    : "w-[88px] h-[55px] sm:w-[106px] sm:h-[67px]";
  const leafTextClass = dense ? "text-[10px] sm:text-[11px]" : "text-[12px] sm:text-[13px]";

  const angleStep = (2 * Math.PI) / items.length;
  const points = items.map((item, i) => {
    const angle = angleStep * i - Math.PI / 2;
    return {
      item,
      x: 50 + RADIUS_PERCENT * Math.cos(angle),
      y: 50 + RADIUS_PERCENT * Math.sin(angle),
      angle,
    };
  });

  return (
    <div className="relative mx-auto aspect-square w-full max-w-[460px] py-4 sm:max-w-[530px]">
      <svg
        className="absolute inset-0 h-full w-full overflow-visible"
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid meet"
      >
        {points.map((p, i) => {
          const dirX = Math.cos(p.angle);
          const dirY = Math.sin(p.angle);
          const perpX = -dirY;
          const perpY = dirX;
          const startR = 13;
          const endR = dense ? 10 : 12;
          const startX = 50 + dirX * startR;
          const startY = 50 + dirY * startR;
          const endX = p.x - dirX * endR;
          const endY = p.y - dirY * endR;
          const midX = (startX + endX) / 2;
          const midY = (startY + endY) / 2;
          const dist = Math.hypot(endX - startX, endY - startY);
          const bow = dist * 0.22;
          const ctrlX = midX + perpX * bow;
          const ctrlY = midY + perpY * bow;
          const stroke = BRANCH_COLORS[i % BRANCH_COLORS.length];
          const dotX = 0.25 * startX + 0.5 * ctrlX + 0.25 * endX;
          const dotY = 0.25 * startY + 0.5 * ctrlY + 0.25 * endY;
          return (
            <g key={i}>
              <path
                d={`M ${startX} ${startY} Q ${ctrlX} ${ctrlY} ${endX} ${endY}`}
                fill="none"
                stroke={stroke}
                strokeWidth={0.55}
                strokeLinecap="round"
                opacity={0.8}
              />
              <circle cx={dotX} cy={dotY} r={0.7} fill={stroke} opacity={0.8} />
            </g>
          );
        })}
      </svg>

      <div
        className="absolute left-1/2 top-1/2 w-[106px] sm:w-[123px] -translate-x-1/2 -translate-y-1/2"
        style={{ aspectRatio: CENTER_ASPECT }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/portfolio-node-center.png"
          alt=""
          className="absolute inset-0 h-full w-full object-fill drop-shadow-md"
        />
        <div className="relative flex h-full w-full items-center justify-center px-[22%] pb-[16%] pt-[26%] text-center">
          <span className="font-display text-[15px] leading-tight break-words text-wood-900 sm:text-[17px]">
            {name}
          </span>
        </div>
      </div>

      {points.map((p, i) => {
        const img = NODE_IMAGES[i % NODE_IMAGES.length];
        return (
          <div
            key={i}
            style={{ left: `${p.x}%`, top: `${p.y}%` }}
            title={p.item}
            className={`absolute -translate-x-1/2 -translate-y-1/2 ${leafSizeClass}`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={img}
              alt=""
              className="absolute inset-0 h-full w-full object-fill drop-shadow-md"
            />
            <div className="relative flex h-full w-full items-center justify-center px-[16%] text-center">
              <span
                className={`line-clamp-3 ${leafTextClass} font-display font-bold leading-tight break-words text-wood-900`}
              >
                {p.item}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

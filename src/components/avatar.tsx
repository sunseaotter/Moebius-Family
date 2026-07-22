export function Avatar({
  userId,
  name,
  hasPhoto,
  size = 48,
}: {
  userId: string;
  name: string;
  hasPhoto: boolean;
  size?: number;
}) {
  if (!hasPhoto) {
    const initial = name.trim().charAt(0).toUpperCase() || "?";
    return (
      <div
        className="flex shrink-0 items-center justify-center rounded-full bg-sage-200 font-display text-sage-800"
        style={{ width: size, height: size, fontSize: size * 0.4 }}
      >
        {initial}
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`/api/members/${userId}/photo`}
      alt={name}
      className="shrink-0 rounded-full border border-wood-200 object-cover"
      style={{ width: size, height: size }}
    />
  );
}

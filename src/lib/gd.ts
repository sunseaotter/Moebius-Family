export const GD_SLOTS = 10;

/** Pads/truncates a GD list to exactly GD_SLOTS entries so the form always renders 10 boxes. */
export function normalizeGd(gd: string[] | undefined | null): string[] {
  const values = (gd ?? []).slice(0, GD_SLOTS).map((v) => v ?? "");
  while (values.length < GD_SLOTS) values.push("");
  return values;
}

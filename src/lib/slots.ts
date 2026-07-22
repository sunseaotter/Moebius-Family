export const GD_SLOTS = 10;
export const WORK_PORTFOLIO_SLOTS = 10;
export const PERSONAL_WEBSITE_SLOTS = 3;

export const MIN_GD_ENTRIES = 3;
export const MIN_WORK_PORTFOLIO_ENTRIES = 1;

/** Pads/truncates a list to exactly `slots` entries so the form always renders the same number of boxes. */
export function normalizeSlots(values: string[] | undefined | null, slots: number): string[] {
  const v = (values ?? []).slice(0, slots).map((x) => x ?? "");
  while (v.length < slots) v.push("");
  return v;
}

export function normalizeGd(gd: string[] | undefined | null): string[] {
  return normalizeSlots(gd, GD_SLOTS);
}

export function normalizeWorkPortfolio(workPortfolio: string[] | undefined | null): string[] {
  return normalizeSlots(workPortfolio, WORK_PORTFOLIO_SLOTS);
}

export function normalizePersonalWebsite(personalWebsite: string[] | undefined | null): string[] {
  return normalizeSlots(personalWebsite, PERSONAL_WEBSITE_SLOTS);
}

export function countFilled(values: string[]): number {
  return values.filter((v) => v.trim().length > 0).length;
}

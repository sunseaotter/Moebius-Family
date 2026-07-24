"use client";

export function MembersFilterForm({
  query,
  nationality,
  tttGroup,
  nationalityOptions,
  tttGroupOptions,
}: {
  query: string;
  nationality: string;
  tttGroup: string;
  nationalityOptions: string[];
  tttGroupOptions: string[];
}) {
  return (
    <form className="mb-8 space-y-3">
      <input
        type="text"
        name="q"
        defaultValue={query}
        placeholder="Search by name, location, TTT group, GD, about you, or anything in their profile…"
        className="w-full rounded-full border border-wood-200 bg-white px-5 py-3 text-wood-900 focus:border-sage-500 focus:outline-none"
      />
      <div className="flex flex-col gap-3 sm:flex-row">
        <select
          name="nationality"
          defaultValue={nationality}
          onChange={(e) => e.currentTarget.form?.requestSubmit()}
          className="flex-1 rounded-full border border-wood-200 bg-white px-4 py-2 text-sm text-wood-900 focus:border-sage-500 focus:outline-none"
        >
          <option value="">Filter by location…</option>
          {nationalityOptions.map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>
        <select
          name="tttGroup"
          defaultValue={tttGroup}
          onChange={(e) => e.currentTarget.form?.requestSubmit()}
          className="flex-1 rounded-full border border-wood-200 bg-white px-4 py-2 text-sm text-wood-900 focus:border-sage-500 focus:outline-none"
        >
          <option value="">Filter by TTT group…</option>
          {tttGroupOptions.map((g) => (
            <option key={g} value={g}>
              {g}
            </option>
          ))}
        </select>
      </div>
    </form>
  );
}

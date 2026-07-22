import { GD_SLOTS, normalizeGd } from "@/lib/gd";

export type ProfileFieldDefaults = {
  name?: string;
  nationality?: string;
  tttStartYear?: number;
  tttStartMonth?: number;
  tttGroupName?: string;
  lifePurpose?: string;
  gd?: string[];
  contactEmail?: string;
  contactEmailPublic?: boolean;
  fbId?: string | null;
  personalWebsite?: string | null;
};

const inputClass =
  "w-full rounded-lg border border-wood-200 bg-white px-3 py-2 text-wood-900 focus:border-sage-500 focus:outline-none";
const labelClass = "block text-sm text-wood-700 mb-1";

export function CommunityProfileFields({ defaults }: { defaults?: ProfileFieldDefaults }) {
  const gd = normalizeGd(defaults?.gd);

  return (
    <div className="space-y-6">
      <div>
        <label className={labelClass} htmlFor="name">
          Name
        </label>
        <input
          id="name"
          name="name"
          required
          defaultValue={defaults?.name}
          className={inputClass}
        />
      </div>

      <div>
        <label className={labelClass} htmlFor="nationality">
          Nationality
        </label>
        <input
          id="nationality"
          name="nationality"
          required
          defaultValue={defaults?.nationality}
          className={inputClass}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass} htmlFor="tttStartYear">
            TTT Starting Year
          </label>
          <input
            id="tttStartYear"
            name="tttStartYear"
            type="number"
            min={1900}
            max={2100}
            required
            defaultValue={defaults?.tttStartYear}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass} htmlFor="tttStartMonth">
            TTT Starting Month
          </label>
          <input
            id="tttStartMonth"
            name="tttStartMonth"
            type="number"
            min={1}
            max={12}
            required
            defaultValue={defaults?.tttStartMonth}
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label className={labelClass} htmlFor="tttGroupName">
          TTT Group Name
        </label>
        <input
          id="tttGroupName"
          name="tttGroupName"
          required
          defaultValue={defaults?.tttGroupName}
          className={inputClass}
        />
      </div>

      <div>
        <label className={labelClass} htmlFor="lifePurpose">
          Your Life Purpose
        </label>
        <textarea
          id="lifePurpose"
          name="lifePurpose"
          required
          rows={3}
          defaultValue={defaults?.lifePurpose}
          className={inputClass}
        />
      </div>

      <div>
        <span className={labelClass}>Your GD</span>
        <div className="grid grid-cols-2 gap-3">
          {Array.from({ length: GD_SLOTS }).map((_, i) => (
            <input
              key={i}
              name="gd"
              placeholder={`GD ${i + 1}`}
              defaultValue={gd[i]}
              className={inputClass}
            />
          ))}
        </div>
      </div>

      <div>
        <label className={labelClass} htmlFor="contactEmail">
          Contact Email
        </label>
        <input
          id="contactEmail"
          name="contactEmail"
          type="email"
          required
          defaultValue={defaults?.contactEmail}
          className={inputClass}
        />
        <label className="mt-2 flex items-center gap-2 text-sm text-wood-700">
          <input
            type="checkbox"
            name="contactEmailPublic"
            defaultChecked={defaults?.contactEmailPublic}
            className="rounded border-wood-300"
          />
          Show my contact email publicly on my profile
        </label>
      </div>

      <div>
        <label className={labelClass} htmlFor="fbId">
          FB ID (optional)
        </label>
        <input id="fbId" name="fbId" defaultValue={defaults?.fbId ?? ""} className={inputClass} />
      </div>

      <div>
        <label className={labelClass} htmlFor="personalWebsite">
          Personal Website (optional)
        </label>
        <input
          id="personalWebsite"
          name="personalWebsite"
          defaultValue={defaults?.personalWebsite ?? ""}
          className={inputClass}
        />
      </div>
    </div>
  );
}

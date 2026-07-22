"use client";

import { useState } from "react";
import {
  GD_SLOTS,
  WORK_PORTFOLIO_SLOTS,
  PERSONAL_WEBSITE_SLOTS,
  MIN_GD_ENTRIES,
  MIN_WORK_PORTFOLIO_ENTRIES,
  normalizeGd,
  normalizeWorkPortfolio,
  normalizePersonalWebsite,
} from "@/lib/slots";
import { NATIONALITIES, NATIONALITY_OPTIONS } from "@/lib/validation";
import { PhotoUploadField } from "@/components/photo-upload-field";

export type ProfileFieldDefaults = {
  name?: string;
  alsoKnownAs?: string | null;
  nationality?: string;
  tttStartYear?: number;
  tttStartMonth?: number;
  tttGroupName?: string;
  lifePurpose?: string;
  gd?: string[];
  workPortfolio?: string[];
  contactEmail?: string;
  contactEmailPublic?: boolean;
  fbId?: string | null;
  personalWebsite?: string[];
};

export type ProfilePhoto = {
  userId: string;
  hasPhoto: boolean;
};

const inputClass =
  "w-full rounded-lg border border-wood-200 bg-white px-3 py-2 text-wood-900 focus:border-sage-500 focus:outline-none";
const labelClass = "block text-sm text-wood-700 mb-1";

export function CommunityProfileFields({
  defaults,
  photo,
}: {
  defaults?: ProfileFieldDefaults;
  photo?: ProfilePhoto;
}) {
  const gd = normalizeGd(defaults?.gd);
  const workPortfolio = normalizeWorkPortfolio(defaults?.workPortfolio);
  const personalWebsite = normalizePersonalWebsite(defaults?.personalWebsite);

  const isKnownNationality = (NATIONALITIES as readonly string[]).includes(
    defaults?.nationality ?? ""
  );
  const [nationality, setNationality] = useState(
    !defaults?.nationality ? "" : isKnownNationality ? defaults.nationality : "Others"
  );

  return (
    <div className="space-y-6">
      <PhotoUploadField
        existingPhotoUrl={photo?.hasPhoto ? `/api/members/${photo.userId}/photo` : undefined}
      />

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
        <label className={labelClass} htmlFor="alsoKnownAs">
          Also Known As
        </label>
        <input
          id="alsoKnownAs"
          name="alsoKnownAs"
          defaultValue={defaults?.alsoKnownAs ?? ""}
          className={inputClass}
        />
      </div>

      <div>
        <label className={labelClass} htmlFor="nationality">
          Nationality
        </label>
        <select
          id="nationality"
          name="nationality"
          required
          value={nationality}
          onChange={(e) => setNationality(e.target.value)}
          className={inputClass}
        >
          <option value="" disabled>
            Select nationality…
          </option>
          {NATIONALITY_OPTIONS.map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>
        {nationality === "Others" && (
          <input
            name="nationalityOther"
            placeholder="Please specify your nationality"
            defaultValue={isKnownNationality ? "" : defaults?.nationality ?? ""}
            className={`${inputClass} mt-2`}
          />
        )}
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
        <p className="mb-2 text-xs text-wood-500">
          {GD_SLOTS} spaces available — please fill in at least {MIN_GD_ENTRIES}.
        </p>
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
        <span className={labelClass}>Meaningful Work Portfolio</span>
        <p className="mb-2 text-xs text-wood-500">
          {WORK_PORTFOLIO_SLOTS} spaces available — please fill in at least{" "}
          {MIN_WORK_PORTFOLIO_ENTRIES}.
        </p>
        <div className="grid grid-cols-2 gap-3">
          {Array.from({ length: WORK_PORTFOLIO_SLOTS }).map((_, i) => (
            <input
              key={i}
              name="workPortfolio"
              placeholder={`Meaningful Work Portfolio ${i + 1}`}
              defaultValue={workPortfolio[i]}
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
          FB Page (optional)
        </label>
        <input id="fbId" name="fbId" defaultValue={defaults?.fbId ?? ""} className={inputClass} />
      </div>

      <div>
        <span className={labelClass}>Personal Website (optional)</span>
        <div className="space-y-3">
          {Array.from({ length: PERSONAL_WEBSITE_SLOTS }).map((_, i) => (
            <input
              key={i}
              name="personalWebsite"
              placeholder={`Personal Website ${i + 1}`}
              defaultValue={personalWebsite[i]}
              className={inputClass}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

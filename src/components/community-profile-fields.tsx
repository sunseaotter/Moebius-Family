"use client";

import { useState } from "react";
import { GD_SLOTS, normalizeGd } from "@/lib/gd";
import { MAX_PHOTO_BYTES } from "@/lib/photo";

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
  const [photoError, setPhotoError] = useState<string | null>(null);

  function onPhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file && file.size > MAX_PHOTO_BYTES) {
      setPhotoError("That photo is larger than 1MB — please choose a smaller file.");
      e.target.value = "";
    } else {
      setPhotoError(null);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <span className={labelClass}>Profile Photo</span>
        {photo?.hasPhoto && (
          <div className="mb-3 flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`/api/members/${photo.userId}/photo`}
              alt="Current profile photo"
              className="h-16 w-16 rounded-full border border-wood-200 object-cover"
            />
            <label className="flex items-center gap-2 text-sm text-wood-600">
              <input type="checkbox" name="removePhoto" className="rounded border-wood-300" />
              Remove current photo
            </label>
          </div>
        )}
        <input
          type="file"
          name="photo"
          accept="image/*"
          onChange={onPhotoChange}
          className="block w-full text-sm text-wood-700 file:mr-3 file:rounded-full file:border-0 file:bg-sage-600 file:px-4 file:py-1.5 file:text-white hover:file:bg-sage-700"
        />
        <p className="mt-1 text-xs text-wood-500">JPG or PNG, up to 1MB.</p>
        {photoError && <p className="mt-1 text-sm text-red-600">{photoError}</p>}
      </div>

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

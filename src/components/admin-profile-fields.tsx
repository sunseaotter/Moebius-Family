import { PhotoUploadField } from "@/components/photo-upload-field";

export type AdminProfileFieldDefaults = {
  name?: string;
  contactEmail?: string;
  fbId?: string | null;
};

export type ProfilePhoto = {
  userId: string;
  hasPhoto: boolean;
};

const inputClass =
  "w-full rounded-lg border border-wood-200 bg-white px-3 py-2 text-wood-900 focus:border-sage-500 focus:outline-none";
const labelClass = "block text-sm text-wood-700 mb-1";

export function AdminProfileFields({
  defaults,
  photo,
}: {
  defaults?: AdminProfileFieldDefaults;
  photo?: ProfilePhoto;
}) {
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
      </div>

      <div>
        <label className={labelClass} htmlFor="fbId">
          FB Page (optional)
        </label>
        <input id="fbId" name="fbId" defaultValue={defaults?.fbId ?? ""} className={inputClass} />
      </div>
    </div>
  );
}

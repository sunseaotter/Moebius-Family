import { z } from "zod";
import {
  GD_SLOTS,
  WORK_PORTFOLIO_SLOTS,
  PERSONAL_WEBSITE_SLOTS,
  MIN_GD_ENTRIES,
  MIN_WORK_PORTFOLIO_ENTRIES,
  countFilled,
} from "@/lib/slots";

export const NATIONALITIES = ["China", "Hong Kong", "Japan", "Taiwan"] as const;
export const NATIONALITY_OPTIONS = [...NATIONALITIES, "Others"] as const;

const profileFieldsSchema = z.object({
  name: z.string().trim().min(1, "Please enter your name"),
  alsoKnownAs: z.string().trim().optional().or(z.literal("")),
  nationality: z.enum(NATIONALITY_OPTIONS, {
    message: "Please select your nationality",
  }),
  nationalityOther: z.string().trim().optional().or(z.literal("")),
  tttStartYear: z.coerce.number().int().min(1900).max(2100),
  tttStartMonth: z.coerce.number().int().min(1).max(12),
  tttGroupName: z.string().trim().min(1, "Please enter your TTT group name"),
  lifePurpose: z.string().trim().min(1, "Please enter your Life Purpose"),
  gd: z.array(z.string()).max(GD_SLOTS).default([]),
  workPortfolio: z.array(z.string()).max(WORK_PORTFOLIO_SLOTS).default([]),
  contactEmail: z.string().trim().toLowerCase().email("Please enter a valid contact email"),
  contactEmailPublic: z.coerce.boolean().default(false),
  fbId: z.string().trim().optional().or(z.literal("")),
  personalWebsite: z.array(z.string()).max(PERSONAL_WEBSITE_SLOTS).default([]),
  profilePublic: z.coerce.boolean().default(false),
  aboutYourself: z.string().trim().optional().or(z.literal("")),
});

function checkProfileFields(
  data: {
    gd: string[];
    workPortfolio: string[];
    nationality: string;
    nationalityOther?: string;
  },
  ctx: z.RefinementCtx
) {
  if (countFilled(data.gd) < MIN_GD_ENTRIES) {
    ctx.addIssue({
      code: "custom",
      message: `Please fill in at least ${MIN_GD_ENTRIES} GD entries`,
      path: ["gd"],
    });
  }
  if (countFilled(data.workPortfolio) < MIN_WORK_PORTFOLIO_ENTRIES) {
    ctx.addIssue({
      code: "custom",
      message: `Please fill in at least ${MIN_WORK_PORTFOLIO_ENTRIES} Meaningful Work Portfolio entry`,
      path: ["workPortfolio"],
    });
  }
  if (data.nationality === "Others" && !data.nationalityOther?.trim()) {
    ctx.addIssue({
      code: "custom",
      message: "Please specify your nationality",
      path: ["nationalityOther"],
    });
  }
}

export const registerSchema = z
  .object({
    email: z.string().trim().toLowerCase().email("Please enter a valid email"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .extend(profileFieldsSchema.shape)
  .superRefine((data, ctx) => {
    checkProfileFields(data, ctx);
    if (data.password !== data.confirmPassword) {
      ctx.addIssue({
        code: "custom",
        message: "Passwords do not match",
        path: ["confirmPassword"],
      });
    }
  });

// Min-entry rules aren't enforced on profile edits: members who joined
// before these rules existed shouldn't be blocked from saving unrelated
// changes until they backfill them.
export const profileUpdateSchema = profileFieldsSchema.superRefine((data, ctx) => {
  if (data.nationality === "Others" && !data.nationalityOther?.trim()) {
    ctx.addIssue({
      code: "custom",
      message: "Please specify your nationality",
      path: ["nationalityOther"],
    });
  }
});

export const adminProfileUpdateSchema = z.object({
  name: z.string().trim().min(1, "Please enter your name"),
  contactEmail: z.string().trim().toLowerCase().email("Please enter a valid contact email"),
  fbId: z.string().trim().optional().or(z.literal("")),
});

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Please enter your current password"),
    newPassword: z.string().min(8, "New password must be at least 8 characters"),
    confirmNewPassword: z.string().min(1, "Please confirm your new password"),
  })
  .superRefine((data, ctx) => {
    if (data.newPassword !== data.confirmNewPassword) {
      ctx.addIssue({
        code: "custom",
        message: "New passwords do not match",
        path: ["confirmNewPassword"],
      });
    }
  });

export const forgotPasswordSchema = z.object({
  email: z.string().trim().toLowerCase().email(),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

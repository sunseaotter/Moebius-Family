import { z } from "zod";
import {
  GD_SLOTS,
  WORK_PORTFOLIO_SLOTS,
  MIN_GD_ENTRIES,
  MIN_WORK_PORTFOLIO_ENTRIES,
  countFilled,
} from "@/lib/slots";

export const NATIONALITIES = ["China", "Hong Kong", "Japan", "Taiwan"] as const;

const profileFieldsSchema = z.object({
  name: z.string().trim().min(1, "Please enter your name"),
  nationality: z.enum(NATIONALITIES, {
    message: "Please select your nationality",
  }),
  tttStartYear: z.coerce.number().int().min(1900).max(2100),
  tttStartMonth: z.coerce.number().int().min(1).max(12),
  tttGroupName: z.string().trim().min(1, "Please enter your TTT group name"),
  lifePurpose: z.string().trim().min(1, "Please enter your Life Purpose"),
  gd: z.array(z.string()).max(GD_SLOTS).default([]),
  workPortfolio: z.array(z.string()).max(WORK_PORTFOLIO_SLOTS).default([]),
  contactEmail: z.string().trim().toLowerCase().email("Please enter a valid contact email"),
  contactEmailPublic: z.coerce.boolean().default(false),
  fbId: z.string().trim().optional().or(z.literal("")),
  personalWebsite: z.string().trim().optional().or(z.literal("")),
});

function checkMinEntries(
  data: { gd: string[]; workPortfolio: string[] },
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
      message: `Please fill in at least ${MIN_WORK_PORTFOLIO_ENTRIES} Work Portfolio entry`,
      path: ["workPortfolio"],
    });
  }
}

export const registerSchema = z
  .object({
    email: z.string().trim().toLowerCase().email("Please enter a valid email"),
    password: z.string().min(8, "Password must be at least 8 characters"),
  })
  .extend(profileFieldsSchema.shape)
  .superRefine(checkMinEntries);

// Not enforced on profile edits: members who joined before this rule existed
// shouldn't be blocked from saving unrelated changes until they backfill it.
export const profileUpdateSchema = profileFieldsSchema;

export const forgotPasswordSchema = z.object({
  email: z.string().trim().toLowerCase().email(),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

import { z } from "zod";
import { GD_SLOTS } from "@/lib/gd";

export const registerSchema = z.object({
  name: z.string().trim().min(1, "Please enter your name"),
  email: z.string().trim().toLowerCase().email("Please enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  nationality: z.string().trim().min(1, "Please enter your nationality"),
  tttStartYear: z.coerce.number().int().min(1900).max(2100),
  tttStartMonth: z.coerce.number().int().min(1).max(12),
  tttGroupName: z.string().trim().min(1, "Please enter your TTT group name"),
  lifePurpose: z.string().trim().min(1, "Please enter your Life Purpose"),
  gd: z.array(z.string()).max(GD_SLOTS).default([]),
  contactEmail: z.string().trim().toLowerCase().email("Please enter a valid contact email"),
  contactEmailPublic: z.coerce.boolean().default(false),
  fbId: z.string().trim().optional().or(z.literal("")),
  personalWebsite: z.string().trim().optional().or(z.literal("")),
});

export const profileUpdateSchema = registerSchema.omit({ password: true, email: true });

export const forgotPasswordSchema = z.object({
  email: z.string().trim().toLowerCase().email(),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

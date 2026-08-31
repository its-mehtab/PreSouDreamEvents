import { z } from "zod";

// Validates 10-digit Indian phone numbers or general formats
export const phoneSchema = z
  .string()
  .min(10, "Phone number must be at least 10 digits")
  .max(15, "Phone number is too long")
  .regex(/^\+?[0-9]+$/, "Must contain only digits and optional + prefix");

export const requestOtpSchema = z.object({
  phone: phoneSchema,
});

export type RequestOtpValues = z.infer<typeof requestOtpSchema>;

export const verifyOtpSchema = z.object({
  code: z.string().length(6, "OTP must be exactly 6 digits"),
});

export type VerifyOtpValues = z.infer<typeof verifyOtpSchema>;

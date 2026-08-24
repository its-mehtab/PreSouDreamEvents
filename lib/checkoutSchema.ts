import { z } from "zod";

export const checkoutSchema = z.object({
  fullName: z.string().min(2, "Enter your full name"),
  phone: z
    .string()
    .min(10, "Enter a valid 10-digit phone number")
    .max(13, "Enter a valid phone number")
    .regex(/^[0-9+ ]+$/, "Digits only"),
  email: z.string().email("Enter a valid email"),
  address: z.string().min(8, "Enter your full address"),
  city: z.string().min(1, "Select a city"),
  venue: z.string().min(1, "Select a venue"),
  eventDate: z.string().min(1, "Select an event date"),
  eventTime: z.string().min(1, "Select a time slot"),
  instructions: z.string().max(500).optional(),
  paymentMethod: z.enum(["upi", "card", "netbanking", "pay-on-setup"]),
});

export type CheckoutFormValues = z.infer<typeof checkoutSchema>;

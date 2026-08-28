"use server";

import { z } from "zod";
import prisma from "@/lib/prisma";
import { createSession, deleteSession } from "@/lib/auth/session";
import { revalidatePath } from "next/cache";

const phoneSchema = z.string().min(10, "Invalid phone number");

export async function sendOtp(phone: string) {
  try {
    const validPhone = phoneSchema.parse(phone);
    
    // In production, integrate with SMS gateway (Twilio, MSG91, AWS SNS)
    // For now, mock a 6-digit OTP
    const code = "123456"; // Mock OTP for testing

    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 mins valid

    // In a real app you might want to upsert or just insert
    await prisma.otpCode.create({
      data: {
        phone: validPhone,
        code,
        expiresAt,
      }
    });

    return { success: true, message: "OTP sent successfully" };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function verifyOtp(phone: string, code: string) {
  try {
    const validPhone = phoneSchema.parse(phone);

    // Find valid OTP
    const otpRecord = await prisma.otpCode.findFirst({
      where: {
        phone: validPhone,
        code,
        expiresAt: {
          gt: new Date()
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    if (!otpRecord) {
      return { success: false, error: "Invalid or expired OTP" };
    }

    // Upsert User
    let user = await prisma.user.findUnique({ where: { phone: validPhone } });
    if (!user) {
      user = await prisma.user.create({
        data: {
          phone: validPhone,
          role: "CUSTOMER", // default
        }
      });
    }

    // Delete used OTPs for this phone
    await prisma.otpCode.deleteMany({
      where: { phone: validPhone }
    });

    // Create session
    await createSession(user.id, user.role, user.phone);

    revalidatePath("/");
    
    return { success: true, message: "Login successful" };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function logout() {
  await deleteSession();
  revalidatePath("/");
  return { success: true };
}


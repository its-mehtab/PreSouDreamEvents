"use server";

import { writeFile, mkdir } from "fs/promises";
import path from "path";

import { z } from "zod";
import prisma from "@/lib/prisma";
import { createSession, deleteSession, getSession } from "@/lib/auth/session";
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

export async function updateUser(formData: FormData) {
  try {
    const session = await getSession();
    if (!session?.userId) return { success: false, error: "Not authenticated" };

    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const address = formData.get("address") as string;
    const dob = formData.get("dob") as string;
    const gender = formData.get("gender") as string;
    const file = formData.get("image") as File | null;
    
    let imageUrl = undefined;
    
    if (file && file.size > 0) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const filename = `${session.userId}-${Date.now()}-${file.name.replace(/\s+/g, '_')}`;
      
      const uploadDir = path.join(process.cwd(), "public", "uploads");
      try {
        await mkdir(uploadDir, { recursive: true });
      } catch (e) {} // ignore if exists
      
      await writeFile(path.join(uploadDir, filename), buffer);
      imageUrl = `/uploads/${filename}`;
    }

    await prisma.user.update({
      where: { id: session.userId },
      data: { 
        name: name || null,
        email: email || null,
        address: address || null,
        dob: dob ? new Date(dob) : null,
        gender: gender || null,
        ...(imageUrl && { image: imageUrl }), // only update image if a new one was uploaded
      },
    });
    
    revalidatePath("/account");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}


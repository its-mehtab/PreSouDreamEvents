"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Phone, LogIn, KeyRound } from "lucide-react";
import { requestOtpSchema, RequestOtpValues, verifyOtpSchema, VerifyOtpValues } from "@/lib/authSchema";
import { sendOtp, verifyOtp } from "@/lib/actions/auth";
import { toast } from "sonner";

import { Suspense } from "react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [step, setStep] = useState<"PHONE" | "OTP">("PHONE");
  const [phoneNumber, setPhoneNumber] = useState("");
  const callbackUrl = searchParams.get("callbackUrl") || "/account";

  const {
    register: registerPhone,
    handleSubmit: handlePhoneSubmit,
    formState: { errors: phoneErrors, isSubmitting: isSending },
  } = useForm<RequestOtpValues>({
    resolver: zodResolver(requestOtpSchema),
  });

  const {
    register: registerOtp,
    handleSubmit: handleOtpSubmit,
    formState: { errors: otpErrors, isSubmitting: isVerifying },
  } = useForm<VerifyOtpValues>({
    resolver: zodResolver(verifyOtpSchema),
  });

  async function onSendOtp(data: RequestOtpValues) {
    const res = await sendOtp(data.phone);
    if (res.success) {
      setPhoneNumber(data.phone);
      setStep("OTP");
      toast.success("OTP sent to your phone");
    } else {
      toast.error(res.error || "Failed to send OTP");
    }
  }

  async function onVerifyOtp(data: VerifyOtpValues) {
    const res = await verifyOtp(phoneNumber, data.code);
    if (res.success) {
      toast.success("Welcome back!");
      router.push(callbackUrl);
    } else {
      toast.error(res.error || "Invalid OTP");
    }
  }

  return (
    <div className="container-app flex min-h-[calc(100vh-200px)] items-center justify-center py-12">
      <div className="w-full max-w-md rounded-2xl border border-ink/10 bg-white p-6 sm:p-8 shadow-card">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-grape-100 text-grape-700">
            <LogIn size={24} />
          </div>
          <h1 className="font-display text-2xl font-bold">Welcome back</h1>
          <p className="mt-2 text-sm text-ink/60">Sign in to manage your bookings and wishlist.</p>
        </div>

        {step === "PHONE" ? (
          <form onSubmit={handlePhoneSubmit(onSendOtp)} className="space-y-4">
            <Field label="Phone Number" icon={Phone} error={phoneErrors.phone?.message}>
              <input
                type="tel"
                {...registerPhone("phone")}
                className="input-field"
                placeholder="98765 43210"
              />
            </Field>

            <button type="submit" disabled={isSending} className="btn-primary w-full mt-4">
              {isSending ? "Sending OTP..." : "Get OTP"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleOtpSubmit(onVerifyOtp)} className="space-y-4">
            <div className="mb-4 text-center text-sm font-medium text-ink/70">
              OTP sent to {phoneNumber}{" "}
              <button type="button" onClick={() => setStep("PHONE")} className="text-grape-600 underline">
                Change
              </button>
            </div>
            <Field label="Enter OTP" icon={KeyRound} error={otpErrors.code?.message}>
              <input
                type="text"
                {...registerOtp("code")}
                className="input-field text-center font-mono tracking-widest"
                placeholder="123456"
                maxLength={6}
              />
            </Field>

            <button type="submit" disabled={isVerifying} className="btn-primary w-full mt-4">
              {isVerifying ? "Verifying..." : "Sign In"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

function Field({
  label,
  icon: Icon,
  error,
  children,
}: {
  label: string;
  icon: any;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-1 flex items-center gap-1.5 text-xs font-semibold text-ink/60">
        <Icon size={13} /> {label}
      </label>
      {children}
      {error && <p className="mt-1 text-xs font-medium text-punch-500">{error}</p>}
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="container-app flex min-h-[calc(100vh-200px)] items-center justify-center py-12">Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
}

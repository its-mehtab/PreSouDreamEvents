"use client";

import { useState, Suspense } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { Phone, KeyRound, Shield } from "lucide-react";
import { requestOtpSchema, RequestOtpValues, verifyOtpSchema, VerifyOtpValues } from "@/lib/authSchema";
import { sendOtp, verifyOtp } from "@/lib/actions/auth";
import { toast } from "sonner";

function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [step, setStep] = useState<"PHONE" | "OTP">("PHONE");
  const [phoneNumber, setPhoneNumber] = useState("");
  const callbackUrl = searchParams.get("callbackUrl") || "/admin";

  const {
    register: registerPhone,
    handleSubmit: handlePhoneSubmit,
    formState: { errors: phoneErrors, isSubmitting: isSending },
  } = useForm<RequestOtpValues>({ resolver: zodResolver(requestOtpSchema) });

  const {
    register: registerOtp,
    handleSubmit: handleOtpSubmit,
    formState: { errors: otpErrors, isSubmitting: isVerifying },
  } = useForm<VerifyOtpValues>({ resolver: zodResolver(verifyOtpSchema) });

  async function onSendOtp(data: RequestOtpValues) {
    const res = await sendOtp(data.phone);
    if (res.success) {
      setPhoneNumber(data.phone);
      setStep("OTP");
      toast.success("OTP sent");
    } else {
      toast.error(res.error || "Failed to send OTP");
    }
  }

  async function onVerifyOtp(data: VerifyOtpValues) {
    const res = await verifyOtp(phoneNumber, data.code);
    if (res.success) {
      toast.success("Access granted");
      router.push(callbackUrl);
    } else {
      toast.error(res.error || "Invalid OTP");
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-grape-500 to-grape-800 shadow-[0_0_40px_rgba(90,34,134,0.4)]">
            <Shield size={26} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Login</h1>
          <p className="mt-1 text-sm text-gray-500">PreSou Dream Events</p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-gray-50 p-7 backdrop-blur">
          {step === "PHONE" ? (
            <form onSubmit={handlePhoneSubmit(onSendOtp)} className="space-y-4">
              <div>
                <label className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-gray-500">
                  <Phone size={11} /> Phone Number
                </label>
                <input
                  type="tel"
                  {...registerPhone("phone")}
                  className="w-full rounded-xl border border-gray-200 bg-gray-100 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 outline-none transition focus:border-grape-500/50 focus:ring-1 focus:ring-grape-500/30"
                  placeholder="98765 43210"
                />
                {phoneErrors.phone && (
                  <p className="mt-1 text-xs text-punch-400">{phoneErrors.phone.message}</p>
                )}
              </div>
              <button
                type="submit"
                disabled={isSending}
                className="w-full rounded-xl bg-grape-600 py-3 text-sm font-semibold text-white transition hover:bg-grape-700 disabled:opacity-50"
              >
                {isSending ? "Sending OTP..." : "Get OTP"}
              </button>
            </form>
          ) : (
            <form onSubmit={handleOtpSubmit(onVerifyOtp)} className="space-y-4">
              <div className="mb-2 rounded-xl bg-gray-100 px-4 py-3 text-center text-sm text-gray-500">
                OTP sent to{" "}
                <span className="font-semibold text-gray-700">{phoneNumber}</span>{" "}
                <button type="button" onClick={() => setStep("PHONE")} className="ml-1 text-grape-400 underline">
                  Change
                </button>
              </div>
              <div>
                <label className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-gray-500">
                  <KeyRound size={11} /> Enter OTP
                </label>
                <input
                  type="text"
                  {...registerOtp("code")}
                  className="w-full rounded-xl border border-gray-200 bg-gray-100 px-4 py-3 text-center font-mono text-xl tracking-[0.5em] text-gray-900 placeholder-gray-400 outline-none transition focus:border-grape-500/50 focus:ring-1 focus:ring-grape-500/30"
                  placeholder="──────"
                  maxLength={6}
                />
                {otpErrors.code && (
                  <p className="mt-1 text-xs text-punch-400">{otpErrors.code.message}</p>
                )}
              </div>
              <button
                type="submit"
                disabled={isVerifying}
                className="w-full rounded-xl bg-grape-600 py-3 text-sm font-semibold text-white transition hover:bg-grape-700 disabled:opacity-50"
              >
                {isVerifying ? "Verifying..." : "Sign In"}
              </button>
            </form>
          )}
        </div>

        <p className="mt-5 text-center text-xs text-gray-400">
          Only authorized admin accounts can access this area.
        </p>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center bg-gray-50 text-gray-500">Loading…</div>}>
      <AdminLoginForm />
    </Suspense>
  );
}

"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { User, Mail, Lock, UserPlus } from "lucide-react";
import { signupSchema, SignupFormValues } from "@/lib/authSchema";
import { toast } from "sonner";

export default function SignupPage() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
  });

  function onSubmit(data: SignupFormValues) {
    // Simulate signup
    toast.success("Account created successfully!");
    router.push("/account");
  }

  return (
    <div className="container-app flex min-h-[calc(100vh-200px)] items-center justify-center py-12">
      <div className="w-full max-w-md rounded-2xl border border-ink/10 bg-white p-6 sm:p-8 shadow-card">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-grape-100 text-grape-700">
            <UserPlus size={24} />
          </div>
          <h1 className="font-display text-2xl font-bold">Create an account</h1>
          <p className="mt-2 text-sm text-ink/60">Join PreSou to manage bookings and save decorations.</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Field label="Full Name" icon={User} error={errors.fullName?.message}>
            <input
              type="text"
              {...register("fullName")}
              className="input-field"
              placeholder="Priya Sharma"
            />
          </Field>
          
          <Field label="Email" icon={Mail} error={errors.email?.message}>
            <input
              type="email"
              {...register("email")}
              className="input-field"
              placeholder="you@email.com"
            />
          </Field>
          
          <Field label="Password" icon={Lock} error={errors.password?.message}>
            <input
              type="password"
              {...register("password")}
              className="input-field"
              placeholder="••••••••"
            />
          </Field>

          <Field label="Confirm Password" icon={Lock} error={errors.confirmPassword?.message}>
            <input
              type="password"
              {...register("confirmPassword")}
              className="input-field"
              placeholder="••••••••"
            />
          </Field>

          <button type="submit" disabled={isSubmitting} className="btn-primary w-full mt-4">
            {isSubmitting ? "Creating account..." : "Create Account"}
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-ink/60">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-grape-700 hover:underline">
            Sign in
          </Link>
        </div>
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

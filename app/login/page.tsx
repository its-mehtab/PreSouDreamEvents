"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Mail, Lock, LogIn } from "lucide-react";
import { loginSchema, LoginFormValues } from "@/lib/authSchema";
import { toast } from "sonner";

export default function LoginPage() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  function onSubmit(data: LoginFormValues) {
    // Simulate login
    toast.success("Welcome back!");
    router.push("/account");
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

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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

          <div className="flex items-center justify-end">
            <Link href="#" className="text-xs font-semibold text-grape-700 hover:underline">
              Forgot password?
            </Link>
          </div>

          <button type="submit" disabled={isSubmitting} className="btn-primary w-full mt-2">
            {isSubmitting ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-ink/60">
          Don't have an account?{" "}
          <Link href="/signup" className="font-semibold text-grape-700 hover:underline">
            Create one
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

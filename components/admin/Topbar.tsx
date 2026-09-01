"use client";

import { useRouter } from "next/navigation";
import { logout } from "@/lib/actions/auth";
import { toast } from "sonner";
import { LogOut, ExternalLink } from "lucide-react";
import Link from "next/link";

export default function AdminTopbar({ phone, role, name }: { phone: string; role: string; name?: string | null }) {
  const router = useRouter();

  async function handleLogout() {
    await logout();
    toast.success("Logged out");
    router.push("/admin/login");
  }

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-gray-200 bg-white px-6">
      <div />

      <div className="flex items-center gap-3">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs text-gray-500 hover:bg-gray-100 hover:text-gray-900/70 transition-colors"
        >
          <ExternalLink size={12} />
          View Store
        </Link>

        <div className="h-4 w-px bg-gray-200" />

        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-grape-100 text-xs font-bold text-grape-700">
            {name ? name.charAt(0).toUpperCase() : phone.slice(-2)}
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-700">{name || phone}</p>
            <p className="text-[10px] text-gray-400">{role === "SUPER_ADMIN" ? "Super Admin" : "Admin"}</p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs text-gray-500 hover:bg-punch-500/10 hover:text-punch-400 transition-colors"
        >
          <LogOut size={13} />
          Logout
        </button>
      </div>
    </header>
  );
}

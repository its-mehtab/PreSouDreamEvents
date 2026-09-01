"use client";

import { useState, useTransition } from "react";
import { adminSetUserRole } from "@/lib/actions/admin";
import { toast } from "sonner";
import StatusBadge from "@/components/admin/StatusBadge";
import { Shield, Users, Search, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { Select } from "@/components/ui/Select";

export default function StaffClient({ staff }: { staff: any[] }) {
  const [search, setSearch] = useState("");
  const [isPending, startTransition] = useTransition();

  const filtered = staff.filter((s) =>
    !search || s.phone.includes(search) || (s.name || "").toLowerCase().includes(search.toLowerCase())
  );

  function handleRoleChange(userId: string, role: string) {
    if (!confirm(`Are you sure you want to change this user's role to ${role}?`)) return;
    startTransition(async () => {
      const res = await adminSetUserRole(userId, role as any);
      if (res.success) toast.success("Role updated");
      else toast.error("Failed to update role");
    });
  }

  return (
    <div className="space-y-4 max-w-4xl">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2"><Shield size={20} className="text-marigold-400" /> Staff Management</h1>
          <p className="text-sm text-gray-500">Manage Admin and Super Admin access.</p>
        </div>
      </div>

      <div className="rounded-2xl border border-marigold-400/20 bg-marigold-400/5 p-4 mb-4">
        <p className="text-xs text-marigold-400">
          <strong>Note:</strong> Super Admins have access to everything, including this page and Audit Logs. Regular Admins cannot see this page.
        </p>
      </div>

      <div className="relative">
        <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name or phone…"
          className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-4 text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-grape-500/40 transition"
        />
      </div>

      <div className="rounded-2xl border border-gray-200 bg-gray-50 p-1">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50 text-left">
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-400">User</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-400">Phone</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-400 text-center">Role</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-400 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((user) => (
                <tr key={user.id} className="border-b border-gray-200 last:border-0 hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-100 text-[11px] font-bold text-gray-500">
                        {(user.name || user.phone).charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium text-gray-700">{user.name || "—"}</p>
                        {user.email && <p className="text-xs text-gray-400">{user.email}</p>}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-500 font-mono text-xs">{user.phone}</td>
                  <td className="px-4 py-3 text-center">
                    <StatusBadge status={user.role} />
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="w-48 ml-auto text-left">
                      <Select
                        value={user.role}
                        onChange={(val) => handleRoleChange(user.id, val)}
                        options={[
                          { label: "Admin", value: "ADMIN" },
                          { label: "Super Admin", value: "SUPER_ADMIN" },
                          { label: "Revoke Access (Make Customer)", value: "CUSTOMER" },
                        ]}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
      </div>
    </div>
  );
}

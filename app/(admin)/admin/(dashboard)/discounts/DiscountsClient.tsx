"use client";

import { useState, useTransition } from "react";
import { adminUpsertDiscount, adminDeleteDiscount } from "@/lib/actions/admin";
import { toast } from "sonner";
import { Plus, Edit2, Trash2, Loader2, Tag } from "lucide-react";
import { format } from "date-fns";
import StatusBadge from "@/components/admin/StatusBadge";
import { DatePicker } from "@/components/ui/DatePicker";

export default function DiscountsClient({ discounts }: { discounts: any[] }) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const [form, setForm] = useState({
    code: "",
    description: "",
    discountPct: "",
    discountAmt: "",
    minOrderAmt: "",
    isActive: true,
    expiresAt: "",
  });

  function handleEdit(d: any) {
    setEditingId(d.id);
    setForm({
      code: d.code,
      description: d.description || "",
      discountPct: d.discountPct ? String(d.discountPct) : "",
      discountAmt: d.discountAmt ? String(d.discountAmt) : "",
      minOrderAmt: d.minOrderAmt ? String(d.minOrderAmt) : "",
      isActive: d.isActive,
      expiresAt: d.expiresAt ? new Date(d.expiresAt).toISOString().slice(0, 16) : "",
    });
  }

  async function save() {
    startTransition(async () => {
      const res = await adminUpsertDiscount({
        id: editingId === "new" ? undefined : editingId!,
        code: form.code,
        description: form.description || undefined,
        discountPct: form.discountPct ? Number(form.discountPct) : undefined,
        discountAmt: form.discountAmt ? Number(form.discountAmt) : undefined,
        minOrderAmt: form.minOrderAmt ? Number(form.minOrderAmt) : undefined,
        isActive: form.isActive,
        expiresAt: form.expiresAt ? new Date(form.expiresAt) : null,
      });
      if (res.success) {
        toast.success("Discount saved");
        setEditingId(null);
      } else {
        toast.error((res as any).error || "Failed to save");
      }
    });
  }

  async function deleteDiscount(id: string) {
    if (!confirm("Are you sure?")) return;
    startTransition(async () => {
      const res = await adminDeleteDiscount(id);
      if (res.success) toast.success("Deleted");
      else toast.error((res as any).error || "Failed to delete");
    });
  }

  const inputCls = "w-full rounded-xl border border-gray-200 bg-gray-100 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 outline-none transition focus:border-grape-500/40 focus:ring-1 focus:ring-grape-500/20";

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Discounts</h1>
          <p className="text-sm text-gray-500">{discounts.length} total discounts</p>
        </div>
        <button
          onClick={() => { setEditingId("new"); setForm({ code: "", description: "", discountPct: "", discountAmt: "", minOrderAmt: "", isActive: true, expiresAt: "" }); }}
          className="flex items-center gap-2 rounded-xl bg-grape-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-grape-700 transition-colors"
        >
          <Plus size={16} /> Add Discount
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {editingId === "new" && (
          <div className="rounded-2xl border border-grape-500/30 bg-grape-500/5 p-5 space-y-4">
            <h3 className="font-bold text-gray-900 flex items-center gap-2"><Tag size={16} /> New Discount</h3>
            <div className="grid grid-cols-2 gap-4">
              <input value={form.code} onChange={(e) => setForm({...form, code: e.target.value.toUpperCase()})} placeholder="CODE (e.g. SAVE20)" className={inputCls} />
              <input value={form.description} onChange={(e) => setForm({...form, description: e.target.value})} placeholder="Description" className={inputCls} />
              <input type="number" value={form.discountPct} onChange={(e) => setForm({...form, discountPct: e.target.value, discountAmt: ""})} placeholder="Discount %" className={inputCls} />
              <input type="number" value={form.discountAmt} onChange={(e) => setForm({...form, discountAmt: e.target.value, discountPct: ""})} placeholder="Discount ₹" className={inputCls} />
              <input type="number" value={form.minOrderAmt} onChange={(e) => setForm({...form, minOrderAmt: e.target.value})} placeholder="Min Order ₹" className={inputCls} />
              <DatePicker includeTime value={form.expiresAt} onChange={(val) => setForm({...form, expiresAt: val})} placeholder="Expires At" />
            </div>
            <label className="flex cursor-pointer items-center gap-2 text-sm text-gray-600">
              <input type="checkbox" checked={form.isActive} onChange={(e) => setForm({...form, isActive: e.target.checked})} className="h-4 w-4 accent-grape-500 rounded" />
              Active
            </label>
            <div className="flex gap-3 pt-2">
              <button onClick={() => setEditingId(null)} className="flex-1 rounded-xl bg-gray-100 py-2.5 text-sm text-gray-900 hover:bg-gray-200">Cancel</button>
              <button onClick={save} disabled={isPending} className="flex-1 rounded-xl bg-grape-600 py-2.5 text-sm font-semibold text-white hover:bg-grape-700 disabled:opacity-50 flex justify-center items-center">
                {isPending ? <Loader2 size={16} className="animate-spin" /> : "Save Discount"}
              </button>
            </div>
          </div>
        )}

        {discounts.map((d) => (
          editingId === d.id ? (
            <div key={d.id} className="rounded-2xl border border-grape-500/30 bg-grape-500/5 p-5 space-y-4">
              <h3 className="font-bold text-gray-900 flex items-center gap-2"><Tag size={16} /> Edit Discount</h3>
              <div className="grid grid-cols-2 gap-4">
                <input value={form.code} onChange={(e) => setForm({...form, code: e.target.value.toUpperCase()})} placeholder="CODE (e.g. SAVE20)" className={inputCls} />
                <input value={form.description} onChange={(e) => setForm({...form, description: e.target.value})} placeholder="Description" className={inputCls} />
                <input type="number" value={form.discountPct} onChange={(e) => setForm({...form, discountPct: e.target.value, discountAmt: ""})} placeholder="Discount %" className={inputCls} />
                <input type="number" value={form.discountAmt} onChange={(e) => setForm({...form, discountAmt: e.target.value, discountPct: ""})} placeholder="Discount ₹" className={inputCls} />
                <input type="number" value={form.minOrderAmt} onChange={(e) => setForm({...form, minOrderAmt: e.target.value})} placeholder="Min Order ₹" className={inputCls} />
                <DatePicker includeTime value={form.expiresAt} onChange={(val) => setForm({...form, expiresAt: val})} placeholder="Expires At" />
              </div>
              <label className="flex cursor-pointer items-center gap-2 text-sm text-gray-600">
                <input type="checkbox" checked={form.isActive} onChange={(e) => setForm({...form, isActive: e.target.checked})} className="h-4 w-4 accent-grape-500 rounded" />
                Active
              </label>
              <div className="flex gap-3 pt-2">
                <button onClick={() => setEditingId(null)} className="flex-1 rounded-xl bg-gray-100 py-2.5 text-sm text-gray-900 hover:bg-gray-200">Cancel</button>
                <button onClick={save} disabled={isPending} className="flex-1 rounded-xl bg-grape-600 py-2.5 text-sm font-semibold text-white hover:bg-grape-700 disabled:opacity-50 flex justify-center items-center">
                  {isPending ? <Loader2 size={16} className="animate-spin" /> : "Save Discount"}
                </button>
              </div>
            </div>
          ) : (
            <div key={d.id} className="rounded-2xl border border-gray-200 bg-gray-50 p-5 flex flex-col justify-between hover:bg-white/[0.05] transition-colors">
              <div>
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg font-mono">{d.code}</h3>
                    {d.description && <p className="mt-1 text-sm text-gray-500">{d.description}</p>}
                  </div>
                  <StatusBadge status={d.isActive ? "active" : "inactive"} />
                </div>
                
                <div className="mt-4 space-y-1.5 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Value:</span>
                    <span className="font-semibold text-gray-700">{d.discountPct ? `${d.discountPct}%` : `₹${d.discountAmt}`}</span>
                  </div>
                  {d.minOrderAmt && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Min Order:</span>
                      <span className="text-gray-700">₹{d.minOrderAmt}</span>
                    </div>
                  )}
                  {d.expiresAt && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Expires:</span>
                      <span className="text-gray-700">{format(new Date(d.expiresAt), "dd MMM yyyy, HH:mm")}</span>
                    </div>
                  )}
                  <div className="flex justify-between border-t border-gray-200 mt-2 pt-2">
                    <span className="text-gray-500">Uses:</span>
                    <span className="text-gray-700">{d._count.bookings}</span>
                  </div>
                </div>
              </div>
              <div className="mt-5 flex gap-2">
                <button onClick={() => handleEdit(d)} className="flex-1 rounded-lg bg-gray-100 py-2 text-xs font-semibold text-gray-500 hover:bg-grape-600/20 hover:text-grape-400 transition-colors flex justify-center items-center gap-1"><Edit2 size={13} /> Edit</button>
                <button onClick={() => deleteDiscount(d.id)} disabled={isPending} className="rounded-lg bg-gray-100 px-4 py-2 text-gray-500 hover:bg-punch-500/20 hover:text-punch-400 transition-colors"><Trash2 size={14} /></button>
              </div>
            </div>
          )
        ))}
      </div>
    </div>
  );
}

"use client";

import { useState, useTransition, useEffect } from "react";
import {
  adminUpsertOccasion,
  adminDeleteOccasion,
  adminUpsertCity,
  adminDeleteCity,
  adminCreateAddOn,
  adminUpdateAddOn,
  adminDeleteAddOn,
} from "@/lib/actions/admin";
import { toast } from "sonner";
import {
  Plus,
  Edit2,
  Trash2,
  Tag,
  MapPin,
  Loader2,
  Package,
  X,
  IndianRupee,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { formatPrice } from "@/lib/utils";
import { uploadImage } from "@/lib/actions/upload";
import Image from "next/image";
import { Upload } from "lucide-react";

type Tab = "occasions" | "cities" | "addons";

interface AddOn {
  id: string;
  name: string;
  price: number;
  image?: string | null;
  _count: { products: number };
}

// ─── Single-image uploader for the modal ────────────────────────────────────
function SingleImageUploader({
  value,
  onChange,
}: {
  value: string;
  onChange: (url: string) => void;
}) {
  const [uploading, setUploading] = useState(false);

  async function handleFile(file: File) {
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    const res = await uploadImage(fd);
    setUploading(false);
    if (res.success && res.url) {
      onChange(res.url);
      toast.success("Image uploaded");
    } else {
      toast.error("Failed to upload image");
    }
  }

  return (
    <div>
      <p className="mb-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">
        Image <span className="normal-case font-normal text-gray-400">(optional)</span>
      </p>
      <label className="relative flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 py-5 text-center transition hover:border-grape-500/40 hover:bg-grape-50">
        <input
          type="file"
          accept="image/*"
          className="hidden"
          disabled={uploading}
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) handleFile(f);
          }}
        />
        {value ? (
          <div className="relative h-24 w-24 overflow-hidden rounded-xl border border-gray-200">
            <Image src={value} alt="Add-on" fill className="object-cover" sizes="96px" />
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onChange("");
              }}
              className="absolute right-1 top-1 rounded-full bg-black/60 p-0.5 text-white hover:bg-punch-500 transition-colors"
            >
              <X size={11} />
            </button>
          </div>
        ) : uploading ? (
          <Loader2 size={22} className="animate-spin text-grape-400" />
        ) : (
          <Upload size={22} className="text-gray-400" />
        )}
        <p className="text-xs text-gray-400">
          {uploading ? "Uploading…" : value ? "Click to replace" : "Click or drag to upload"}
        </p>
      </label>
    </div>
  );
}

// ─── Add-On Modal ────────────────────────────────────────────────────────────
function AddOnModal({
  mode,
  initial,
  onClose,
  onSaved,
}: {
  mode: "create" | "edit";
  initial?: AddOn;
  onClose: () => void;
  onSaved: (addOn: AddOn) => void;
}) {
  const [isPending, startTransition] = useTransition();
  const [form, setForm] = useState({
    name: initial?.name ?? "",
    price: initial ? String(initial.price) : "",
    image: initial?.image ?? "",
  });

  // Close on Escape
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  function save() {
    if (!form.name.trim()) { toast.error("Name is required."); return; }
    const price = parseFloat(form.price);
    if (isNaN(price) || price < 0) { toast.error("Enter a valid price."); return; }

    startTransition(async () => {
      if (mode === "create") {
        const res = await adminCreateAddOn({
          name: form.name,
          price,
          image: form.image || undefined,
        });
        if (res.success && res.addOn) {
          toast.success("Add-on created!");
          onSaved({ ...res.addOn, _count: { products: 0 } } as AddOn);
          onClose();
        } else {
          toast.error("Failed to create add-on");
        }
      } else if (initial) {
        const res = await adminUpdateAddOn(initial.id, {
          name: form.name,
          price,
          image: form.image || undefined,
        });
        if (res.success && res.addOn) {
          toast.success("Add-on updated!");
          onSaved({ ...initial, name: form.name, price, image: form.image || null });
          onClose();
        } else {
          toast.error("Failed to update add-on");
        }
      }
    });
  }

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Backdrop */}
      <motion.div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      />

      {/* Modal card */}
      <motion.div
        className="relative z-10 w-full max-w-md rounded-2xl border border-gray-200 bg-white p-6 shadow-2xl"
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 12, scale: 0.98 }}
        transition={{ type: "spring", damping: 22, stiffness: 280 }}
      >
        {/* Header */}
        <div className="mb-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-grape-100">
              <Package size={15} className="text-grape-600" />
            </div>
            <h2 className="text-base font-bold text-gray-900">
              {mode === "create" ? "New Add-On" : "Edit Add-On"}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Form */}
        <div className="space-y-4">
          {/* Name */}
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-500">
              Name <span className="text-punch-500">*</span>
            </label>
            <div className="relative">
              <Package size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                autoFocus
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                onKeyDown={(e) => e.key === "Enter" && save()}
                placeholder="e.g. Helium Balloons, LED Lights, Fog Machine…"
                className="w-full rounded-xl border border-gray-200 bg-gray-100 py-2.5 pl-9 pr-4 text-sm text-gray-900 placeholder-gray-400 outline-none transition focus:border-grape-500/40 focus:ring-1 focus:ring-grape-500/20"
              />
            </div>
          </div>

          {/* Price */}
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-500">
              Price <span className="text-punch-500">*</span>
            </label>
            <div className="relative">
              <IndianRupee size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="number"
                min="0"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                onKeyDown={(e) => e.key === "Enter" && save()}
                placeholder="e.g. 299"
                className="w-full rounded-xl border border-gray-200 bg-gray-100 py-2.5 pl-9 pr-4 text-sm text-gray-900 placeholder-gray-400 outline-none transition focus:border-grape-500/40 focus:ring-1 focus:ring-grape-500/20"
              />
            </div>
          </div>

          {/* Image upload */}
          <SingleImageUploader
            value={form.image}
            onChange={(url) => setForm({ ...form, image: url })}
          />
        </div>

        {/* Actions */}
        <div className="mt-6 flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-xl border border-gray-200 bg-gray-100 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={save}
            disabled={isPending}
            className="flex-1 rounded-xl bg-grape-600 py-2.5 text-sm font-semibold text-white hover:bg-grape-700 disabled:opacity-60 transition-colors flex items-center justify-center gap-2"
          >
            {isPending ? (
              <Loader2 size={15} className="animate-spin" />
            ) : mode === "create" ? (
              <><Plus size={14} /> Create Add-On</>
            ) : (
              "Save Changes"
            )}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────
export default function TaxonomyClient({
  occasions,
  cities,
  addOns,
}: {
  occasions: any[];
  cities: any[];
  addOns: AddOn[];
}) {
  const [activeTab, setActiveTab] = useState<Tab>("occasions");
  const [isPending, startTransition] = useTransition();

  // Occasions
  const [editingOccasion, setEditingOccasion] = useState<any>(null);
  const [occasionForm, setOccasionForm] = useState({ name: "", slug: "", icon: "", image: "", description: "" });

  // Cities
  const [editingCity, setEditingCity] = useState<any>(null);
  const [cityForm, setCityForm] = useState({ name: "", slug: "" });

  // Add-Ons — local list for optimistic updates + modal state
  const [addOnList, setAddOnList] = useState<AddOn[]>(addOns);
  const [addOnModal, setAddOnModal] = useState<{ mode: "create" | "edit"; addon?: AddOn } | null>(null);

  // ─── Occasion handlers ───────────────────────────────────────────────────
  function handleEditOccasion(o: any) {
    setEditingOccasion(o.id);
    setOccasionForm({ name: o.name, slug: o.slug, icon: o.icon || "", image: o.image || "", description: o.description || "" });
  }

  async function saveOccasion() {
    startTransition(async () => {
      const res = await adminUpsertOccasion({ id: editingOccasion === "new" ? undefined : editingOccasion, ...occasionForm });
      if (res.success) { toast.success("Occasion saved"); setEditingOccasion(null); }
      else toast.error((res as any).error || "Failed to save");
    });
  }

  async function deleteOccasion(id: string) {
    if (!confirm("Are you sure?")) return;
    startTransition(async () => {
      const res = await adminDeleteOccasion(id);
      if (res.success) toast.success("Deleted");
      else toast.error((res as any).error || "Failed to delete");
    });
  }

  // ─── City handlers ───────────────────────────────────────────────────────
  function handleEditCity(c: any) {
    setEditingCity(c.id);
    setCityForm({ name: c.name, slug: c.slug });
  }

  async function saveCity() {
    startTransition(async () => {
      const res = await adminUpsertCity({ id: editingCity === "new" ? undefined : editingCity, ...cityForm });
      if (res.success) { toast.success("City saved"); setEditingCity(null); }
      else toast.error((res as any).error || "Failed to save");
    });
  }

  async function deleteCity(id: string) {
    if (!confirm("Are you sure?")) return;
    startTransition(async () => {
      const res = await adminDeleteCity(id);
      if (res.success) toast.success("Deleted");
      else toast.error((res as any).error || "Failed to delete");
    });
  }

  // ─── Add-On handlers ─────────────────────────────────────────────────────
  function handleAddOnSaved(saved: AddOn) {
    setAddOnList((prev) => {
      const exists = prev.find((a) => a.id === saved.id);
      if (exists) return prev.map((a) => (a.id === saved.id ? saved : a));
      return [...prev, saved];
    });
  }

  async function deleteAddOn(id: string, productCount: number) {
    if (productCount > 0) {
      toast.error(`Cannot delete — linked to ${productCount} product(s). Unlink from all products first.`);
      return;
    }
    if (!confirm("Delete this add-on permanently?")) return;
    startTransition(async () => {
      const res = await adminDeleteAddOn(id);
      if (res.success) {
        toast.success("Add-on deleted");
        setAddOnList((prev) => prev.filter((a) => a.id !== id));
      } else {
        toast.error("Failed to delete");
      }
    });
  }

  const inputCls = "w-full rounded-xl border border-gray-200 bg-gray-100 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 outline-none transition focus:border-grape-500/40 focus:ring-1 focus:ring-grape-500/20";
  const tabCls = (t: Tab) =>
    `flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-colors ${activeTab === t ? "bg-grape-600 text-white" : "text-gray-500 hover:bg-gray-100 hover:text-gray-700"}`;

  return (
    <div className="space-y-6">
      {/* Tab Bar */}
      <div className="flex items-center gap-2 border-b border-gray-200 pb-4">
        <button onClick={() => setActiveTab("occasions")} className={tabCls("occasions")}>
          <Tag size={16} /> Occasions
        </button>
        <button onClick={() => setActiveTab("cities")} className={tabCls("cities")}>
          <MapPin size={16} /> Cities
        </button>
        <button onClick={() => setActiveTab("addons")} className={tabCls("addons")}>
          <Package size={16} /> Add-Ons
          <span className={`ml-1 rounded-full px-1.5 py-0.5 text-[10px] font-bold ${activeTab === "addons" ? "bg-white/20 text-white" : "bg-gray-200 text-gray-500"}`}>
            {addOnList.length}
          </span>
        </button>
      </div>

      {/* ── Occasions Tab ── */}
      {activeTab === "occasions" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900">Occasions</h2>
            <button
              onClick={() => { setEditingOccasion("new"); setOccasionForm({ name: "", slug: "", icon: "", image: "", description: "" }); }}
              className="flex items-center gap-2 rounded-xl bg-grape-600 px-3 py-2 text-sm font-semibold text-white hover:bg-grape-700 transition-colors"
            >
              <Plus size={14} /> Add Occasion
            </button>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence>
              {editingOccasion === "new" && (
                <motion.div key="new-occasion" initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="rounded-2xl border border-grape-500/30 bg-grape-500/5 p-4 space-y-3">
                  <input value={occasionForm.name} onChange={(e) => setOccasionForm({ ...occasionForm, name: e.target.value })} placeholder="Name" className={inputCls} />
                  <input value={occasionForm.slug} onChange={(e) => setOccasionForm({ ...occasionForm, slug: e.target.value })} placeholder="Slug" className={inputCls} />
                  <input value={occasionForm.icon} onChange={(e) => setOccasionForm({ ...occasionForm, icon: e.target.value })} placeholder="Icon (emoji or Lucide name)" className={inputCls} />
                  <div className="flex gap-2">
                    <button onClick={() => setEditingOccasion(null)} className="flex-1 rounded-xl bg-gray-100 py-2 text-sm text-gray-900 hover:bg-gray-200">Cancel</button>
                    <button onClick={saveOccasion} disabled={isPending} className="flex-1 rounded-xl bg-grape-600 py-2 text-sm font-semibold text-white hover:bg-grape-700 disabled:opacity-50 flex justify-center items-center">
                      {isPending ? <Loader2 size={16} className="animate-spin" /> : "Save"}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            {occasions.map((o) =>
              editingOccasion === o.id ? (
                <div key={o.id} className="rounded-2xl border border-grape-500/30 bg-grape-500/5 p-4 space-y-3">
                  <input value={occasionForm.name} onChange={(e) => setOccasionForm({ ...occasionForm, name: e.target.value })} placeholder="Name" className={inputCls} />
                  <input value={occasionForm.slug} onChange={(e) => setOccasionForm({ ...occasionForm, slug: e.target.value })} placeholder="Slug" className={inputCls} />
                  <input value={occasionForm.icon} onChange={(e) => setOccasionForm({ ...occasionForm, icon: e.target.value })} placeholder="Icon (emoji or Lucide name)" className={inputCls} />
                  <div className="flex gap-2">
                    <button onClick={() => setEditingOccasion(null)} className="flex-1 rounded-xl bg-gray-100 py-2 text-sm text-gray-900 hover:bg-gray-200">Cancel</button>
                    <button onClick={saveOccasion} disabled={isPending} className="flex-1 rounded-xl bg-grape-600 py-2 text-sm font-semibold text-white hover:bg-grape-700 disabled:opacity-50 flex justify-center items-center">
                      {isPending ? <Loader2 size={16} className="animate-spin" /> : "Save"}
                    </button>
                  </div>
                </div>
              ) : (
                <div key={o.id} className="rounded-2xl border border-gray-200 bg-gray-50 p-4 flex flex-col justify-between hover:bg-white transition-colors">
                  <div>
                    <div className="flex items-center gap-3">
                      {o.icon && <span className="text-xl">{o.icon}</span>}
                      <h3 className="font-bold text-gray-900">{o.name}</h3>
                    </div>
                    <p className="mt-1 text-xs text-gray-500">/{o.slug}</p>
                    <p className="mt-3 text-xs text-gray-400">{o._count.products} products</p>
                  </div>
                  <div className="mt-4 flex gap-2">
                    <button onClick={() => handleEditOccasion(o)} className="flex-1 rounded-lg bg-gray-100 py-1.5 text-xs font-semibold text-gray-500 hover:bg-grape-600/20 hover:text-grape-400 transition-colors flex justify-center items-center gap-1"><Edit2 size={12} /> Edit</button>
                    <button onClick={() => deleteOccasion(o.id)} disabled={isPending} className="rounded-lg bg-gray-100 px-3 py-1.5 text-gray-500 hover:bg-punch-500/20 hover:text-punch-400 transition-colors"><Trash2 size={12} /></button>
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      )}

      {/* ── Cities Tab ── */}
      {activeTab === "cities" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900">Cities</h2>
            <button
              onClick={() => { setEditingCity("new"); setCityForm({ name: "", slug: "" }); }}
              className="flex items-center gap-2 rounded-xl bg-grape-600 px-3 py-2 text-sm font-semibold text-white hover:bg-grape-700 transition-colors"
            >
              <Plus size={14} /> Add City
            </button>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4">
            <AnimatePresence>
              {editingCity === "new" && (
                <motion.div key="new-city" initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="rounded-2xl border border-grape-500/30 bg-grape-500/5 p-4 space-y-3">
                  <input value={cityForm.name} onChange={(e) => setCityForm({ ...cityForm, name: e.target.value })} placeholder="Name" className={inputCls} />
                  <input value={cityForm.slug} onChange={(e) => setCityForm({ ...cityForm, slug: e.target.value })} placeholder="Slug" className={inputCls} />
                  <div className="flex gap-2">
                    <button onClick={() => setEditingCity(null)} className="flex-1 rounded-xl bg-gray-100 py-2 text-sm text-gray-900 hover:bg-gray-200">Cancel</button>
                    <button onClick={saveCity} disabled={isPending} className="flex-1 rounded-xl bg-grape-600 py-2 text-sm font-semibold text-white hover:bg-grape-700 disabled:opacity-50 flex justify-center items-center">
                      {isPending ? <Loader2 size={16} className="animate-spin" /> : "Save"}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            {cities.map((c) =>
              editingCity === c.id ? (
                <div key={c.id} className="rounded-2xl border border-grape-500/30 bg-grape-500/5 p-4 space-y-3">
                  <input value={cityForm.name} onChange={(e) => setCityForm({ ...cityForm, name: e.target.value })} placeholder="Name" className={inputCls} />
                  <input value={cityForm.slug} onChange={(e) => setCityForm({ ...cityForm, slug: e.target.value })} placeholder="Slug" className={inputCls} />
                  <div className="flex gap-2">
                    <button onClick={() => setEditingCity(null)} className="flex-1 rounded-xl bg-gray-100 py-2 text-sm text-gray-900 hover:bg-gray-200">Cancel</button>
                    <button onClick={saveCity} disabled={isPending} className="flex-1 rounded-xl bg-grape-600 py-2 text-sm font-semibold text-white hover:bg-grape-700 disabled:opacity-50 flex justify-center items-center">
                      {isPending ? <Loader2 size={16} className="animate-spin" /> : "Save"}
                    </button>
                  </div>
                </div>
              ) : (
                <div key={c.id} className="rounded-2xl border border-gray-200 bg-gray-50 p-4 flex flex-col justify-between hover:bg-white transition-colors">
                  <div>
                    <h3 className="font-bold text-gray-900">{c.name}</h3>
                    <p className="mt-1 text-xs text-gray-500">/{c.slug}</p>
                    <p className="mt-3 text-xs text-gray-400">{c._count.bookings} bookings</p>
                  </div>
                  <div className="mt-4 flex gap-2">
                    <button onClick={() => handleEditCity(c)} className="flex-1 rounded-lg bg-gray-100 py-1.5 text-xs font-semibold text-gray-500 hover:bg-grape-600/20 hover:text-grape-400 transition-colors flex justify-center items-center gap-1"><Edit2 size={12} /> Edit</button>
                    <button onClick={() => deleteCity(c.id)} disabled={isPending} className="rounded-lg bg-gray-100 px-3 py-1.5 text-gray-500 hover:bg-punch-500/20 hover:text-punch-400 transition-colors"><Trash2 size={12} /></button>
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      )}

      {/* ── Add-Ons Tab ── */}
      {activeTab === "addons" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-gray-900">Add-Ons</h2>
              <p className="text-sm text-gray-500">Global add-on catalog linked to products at checkout.</p>
            </div>
            <button
              onClick={() => setAddOnModal({ mode: "create" })}
              className="flex items-center gap-2 rounded-xl bg-grape-600 px-3 py-2 text-sm font-semibold text-white hover:bg-grape-700 transition-colors"
            >
              <Plus size={14} /> Add Add-On
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence mode="popLayout">
              {addOnList.map((a) => (
                <motion.div
                  key={a.id}
                  layout
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="flex flex-col justify-between rounded-2xl border border-gray-200 bg-white p-5 shadow-sm hover:shadow-md transition-all"
                >
                  <div className="flex items-start gap-3">
                    {a.image ? (
                      <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-gray-100">
                        <Image src={a.image} alt={a.name} fill className="object-cover" sizes="56px" />
                      </div>
                    ) : (
                      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-grape-50 border border-grape-100">
                        <Package size={22} className="text-grape-400" />
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold text-gray-900 truncate">{a.name}</h3>
                      <p className="mt-0.5 text-base font-bold text-grape-600">+{formatPrice(a.price)}</p>
                      <p className="mt-1 text-xs text-gray-400">
                        {a._count.products} product{a._count.products !== 1 ? "s" : ""} linked
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 flex gap-2">
                    <button
                      onClick={() => setAddOnModal({ mode: "edit", addon: a })}
                      className="flex-1 rounded-lg bg-gray-100 py-1.5 text-xs font-semibold text-gray-500 hover:bg-grape-600/20 hover:text-grape-400 transition-colors flex justify-center items-center gap-1"
                    >
                      <Edit2 size={12} /> Edit
                    </button>
                    <button
                      onClick={() => deleteAddOn(a.id, a._count.products)}
                      disabled={isPending}
                      title={a._count.products > 0 ? "Unlink from all products first" : "Delete"}
                      className="rounded-lg bg-gray-100 px-3 py-1.5 text-gray-500 hover:bg-punch-500/20 hover:text-punch-400 transition-colors disabled:opacity-50"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {addOnList.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="col-span-full flex flex-col items-center gap-3 rounded-2xl border border-dashed border-gray-200 py-16 text-center"
              >
                <Package size={36} className="text-gray-300" />
                <p className="text-sm font-medium text-gray-400">No add-ons yet</p>
                <p className="text-xs text-gray-400">Click "Add Add-On" to get started.</p>
                <button
                  onClick={() => setAddOnModal({ mode: "create" })}
                  className="mt-2 flex items-center gap-2 rounded-xl bg-grape-600 px-4 py-2 text-sm font-semibold text-white hover:bg-grape-700 transition-colors"
                >
                  <Plus size={14} /> Add Add-On
                </button>
              </motion.div>
            )}
          </div>
        </div>
      )}

      {/* ── Add-On Modal (portal-like, rendered at root) ── */}
      <AnimatePresence>
        {addOnModal && (
          <AddOnModal
            key={addOnModal.mode + (addOnModal.addon?.id ?? "new")}
            mode={addOnModal.mode}
            initial={addOnModal.addon}
            onClose={() => setAddOnModal(null)}
            onSaved={handleAddOnSaved}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

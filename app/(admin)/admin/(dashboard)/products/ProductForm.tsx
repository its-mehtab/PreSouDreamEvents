"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { adminCreateProduct, adminUpdateProduct, adminCreateAddOn, adminUpsertCustomizationOption, adminDeleteCustomizationOption } from "@/lib/actions/admin";
import ImageUploader from "@/components/admin/ImageUploader";
import { Plus, Trash2, X, GripVertical, Save, ArrowLeft } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { Select } from "@/components/ui/Select";

const DECORATION_TYPES = ["Balloon", "Flowers", "Room Decoration", "Canopy & Terrace", "Candlelight Dinner", "Balloon Bouquet", "Stage & Ceremony", "Combo"];

const productSchema = z.object({
  name: z.string().min(2, "Required"),
  slug: z.string().min(2, "Required").regex(/^[a-z0-9-]+$/, "Lowercase, digits, hyphens only"),
  tagline: z.string().optional(),
  description: z.string().optional(),
  price: z.coerce.number().min(1, "Required"),
  mrp: z.coerce.number().optional(),
  decorationType: z.string().min(1, "Required"),
  themes: z.string().optional(),
  styles: z.string().optional(),
  whatsIncluded: z.string().optional(),
  setupDurationMins: z.coerce.number().default(60),
  cancellationInfo: z.string().optional(),
  numberOfBalloons: z.coerce.number().optional(),
  isCustomizable: z.boolean().default(true),
  isPremium: z.boolean().default(false),
  isTrending: z.boolean().default(false),
  isBestSeller: z.boolean().default(false),
  isNewArrival: z.boolean().default(false),
});

type ProductFormValues = z.infer<typeof productSchema>;

interface ProductFormProps {
  product?: any;
  occasions: { id: string; name: string }[];
  existingAddOns: { id: string; name: string; price: number }[];
}

function FormField({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-500">{label}</label>
      {children}
      {error && <p className="mt-1 text-xs text-punch-400">{error}</p>}
    </div>
  );
}

const inputCls = "w-full rounded-xl border border-gray-200 bg-gray-100 px-3.5 py-2.5 text-sm text-gray-900 placeholder-gray-400 outline-none transition focus:border-grape-500/40 focus:ring-1 focus:ring-grape-500/20";
const checkboxCls = "h-4 w-4 accent-grape-500 rounded cursor-pointer";

export default function ProductForm({ product, occasions, existingAddOns }: ProductFormProps) {
  const router = useRouter();
  const [images, setImages] = useState<string[]>(product?.images ?? []);
  const [selectedOccasionIds, setSelectedOccasionIds] = useState<string[]>(
    product?.occasions?.map((o: any) => o.id) ?? []
  );
  const [linkedAddOnIds, setLinkedAddOnIds] = useState<string[]>(
    product?.addOns?.map((pa: any) => pa.addOnId) ?? []
  );
  const [customizations, setCustomizations] = useState<any[]>(product?.customizations ?? []);
  const [isPending, startTransition] = useTransition();

  const { register, handleSubmit, formState: { errors }, watch, setValue, control } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema) as any,
    defaultValues: product
      ? {
          ...product,
          themes: product.themes?.join(", "),
          styles: product.styles?.join(", "),
          whatsIncluded: product.whatsIncluded?.join("\n"),
        }
      : { isCustomizable: true, isPremium: false, isTrending: false, isBestSeller: false, isNewArrival: false, setupDurationMins: 60 },
  });

  function toggleOccasion(id: string) {
    setSelectedOccasionIds((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
  }

  function toggleAddOn(id: string) {
    setLinkedAddOnIds((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
  }

  async function addCustomization() {
    setCustomizations((prev) => [...prev, { id: null, label: "", type: "text", choices: [], priceDelta: 0 }]);
  }

  async function removeCustomization(idx: number) {
    const c = customizations[idx];
    if (c.id && product?.id) {
      startTransition(async () => {
        await adminDeleteCustomizationOption(c.id);
      });
    }
    setCustomizations((prev) => prev.filter((_, i) => i !== idx));
  }

  function updateCustomization(idx: number, field: string, value: any) {
    setCustomizations((prev) => prev.map((c, i) => i === idx ? { ...c, [field]: value } : c));
  }

  async function onSubmit(values: ProductFormValues) {
    if (images.length === 0) { toast.error("Add at least one image"); return; }

    startTransition(async () => {
      const data = {
        ...values,
        images,
        themes: values.themes ? values.themes.split(",").map((t) => t.trim()).filter(Boolean) : [],
        styles: values.styles ? values.styles.split(",").map((s) => s.trim()).filter(Boolean) : [],
        whatsIncluded: values.whatsIncluded ? values.whatsIncluded.split("\n").map((l) => l.trim()).filter(Boolean) : [],
        occasionIds: selectedOccasionIds,
      };

      let productId = product?.id;
      let res;

      if (product) {
        res = await adminUpdateProduct(product.id, data);
      } else {
        res = await adminCreateProduct(data);
        productId = (res as any).product?.id;
      }

      if (!res.success) { toast.error((res as any).error || "Failed to save product"); return; }

      // Save customizations
      if (productId) {
        for (const c of customizations) {
          if (c.label) {
            await adminUpsertCustomizationOption({
              id: c.id ?? undefined,
              productId,
              label: c.label,
              type: c.type,
              choices: c.choices,
              priceDelta: Number(c.priceDelta ?? 0),
            });
          }
        }
      }

      toast.success(product ? "Product updated" : "Product created");
      router.push("/admin/products");
      router.refresh();
    });
  }

  const boolFields: { key: keyof ProductFormValues; label: string }[] = [
    { key: "isCustomizable", label: "Customizable" },
    { key: "isPremium", label: "Premium" },
    { key: "isTrending", label: "Trending" },
    { key: "isBestSeller", label: "Best Seller" },
    { key: "isNewArrival", label: "New Arrival" },
  ];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button type="button" onClick={() => router.back()} className="rounded-xl p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900/70 transition-colors">
          <ArrowLeft size={18} />
        </button>
        <div className="flex-1">
          <h1 className="text-xl font-bold text-gray-900">{product ? "Edit Product" : "New Product"}</h1>
          {product && <p className="text-sm text-gray-400">ID: {product.id}</p>}
        </div>
        <button
          type="submit"
          disabled={isPending}
          className="flex items-center gap-2 rounded-xl bg-grape-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-grape-700 disabled:opacity-50 transition-colors"
        >
          <Save size={15} />
          {isPending ? "Saving…" : "Save Product"}
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Main fields */}
        <div className="space-y-4 lg:col-span-2">
          <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5 space-y-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Basic Info</p>
            <div className="grid grid-cols-2 gap-4">
              <FormField label="Product Name" error={errors.name?.message}>
                <input {...register("name")} className={inputCls} placeholder="Birthday Balloon Setup" />
              </FormField>
              <FormField label="Slug" error={errors.slug?.message}>
                <input {...register("slug")} className={inputCls} placeholder="birthday-balloon-setup" />
              </FormField>
            </div>
            <FormField label="Tagline" error={errors.tagline?.message}>
              <input {...register("tagline")} className={inputCls} placeholder="Short catchy line" />
            </FormField>
            <FormField label="Description" error={errors.description?.message}>
              <textarea {...register("description")} rows={3} className={inputCls} placeholder="Full description…" />
            </FormField>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5 space-y-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Pricing & Details</p>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              <FormField label="Price (₹)" error={errors.price?.message}>
                <input type="number" {...register("price")} className={inputCls} placeholder="999" />
              </FormField>
              <FormField label="MRP (₹)" error={errors.mrp?.message}>
                <input type="number" {...register("mrp")} className={inputCls} placeholder="1499" />
              </FormField>
              <FormField label="Setup Duration (mins)" error={errors.setupDurationMins?.message}>
                <input type="number" {...register("setupDurationMins")} className={inputCls} placeholder="60" />
              </FormField>
            </div>
            <FormField label="Decoration Type" error={errors.decorationType?.message}>
              <Controller
                control={control}
                name="decorationType"
                render={({ field }) => (
                  <Select
                    options={DECORATION_TYPES}
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Select type…"
                  />
                )}
              />
            </FormField>
            <div className="grid grid-cols-2 gap-4">
              <FormField label="Themes (comma-separated)" error={errors.themes?.message}>
                <input {...register("themes")} className={inputCls} placeholder="Floral, Rustic, Boho" />
              </FormField>
              <FormField label="Styles (comma-separated)" error={errors.styles?.message}>
                <input {...register("styles")} className={inputCls} placeholder="Minimal, Luxe" />
              </FormField>
            </div>
            <FormField label="Number of Balloons" error={errors.numberOfBalloons?.message}>
              <input type="number" {...register("numberOfBalloons")} className={inputCls} placeholder="50" />
            </FormField>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5 space-y-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">What's Included (one per line)</p>
            <textarea {...register("whatsIncluded")} rows={4} className={inputCls} placeholder={"50 latex balloons\nHelium filling\nSetup & cleanup"} />
          </div>

          <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5 space-y-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Cancellation Info</p>
            <textarea {...register("cancellationInfo")} rows={2} className={inputCls} placeholder="Free cancellation up to 24 hours before event." />
          </div>

          {/* Customization Options */}
          <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5 space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Customization Options</p>
              <button type="button" onClick={addCustomization} className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs text-grape-400 hover:bg-grape-600/15 transition-colors">
                <Plus size={13} /> Add Option
              </button>
            </div>
            <AnimatePresence>
              {customizations.map((c, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="rounded-xl border border-gray-200 bg-gray-50 p-4 space-y-3"
                >
                  <div className="flex items-center gap-2">
                    <GripVertical size={14} className="text-gray-400 cursor-move" />
                    <div className="grid flex-1 grid-cols-3 gap-3">
                      <input
                        value={c.label}
                        onChange={(e) => updateCustomization(idx, "label", e.target.value)}
                        className={inputCls}
                        placeholder="Label (e.g. Name on balloon)"
                      />
                      <Select
                        options={["text", "color", "select", "toggle"]}
                        value={c.type}
                        onChange={(val) => updateCustomization(idx, "type", val)}
                        placeholder="Type"
                      />
                      <input
                        type="number"
                        value={c.priceDelta}
                        onChange={(e) => updateCustomization(idx, "priceDelta", e.target.value)}
                        className={inputCls}
                        placeholder="Extra price (₹0)"
                      />
                    </div>
                    <button type="button" onClick={() => removeCustomization(idx)} className="rounded-lg p-1 text-gray-400 hover:text-punch-400 transition-colors">
                      <X size={14} />
                    </button>
                  </div>
                  {(c.type === "select" || c.type === "color") && (
                    <input
                      value={c.choices?.join(", ")}
                      onChange={(e) => updateCustomization(idx, "choices", e.target.value.split(",").map((x: string) => x.trim()))}
                      className={inputCls}
                      placeholder="Choices (comma-separated)"
                    />
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
            {customizations.length === 0 && (
              <p className="text-xs text-gray-400 text-center py-4">No customizations. Click Add Option to create one.</p>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Images */}
          <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5">
            <ImageUploader images={images} onChange={setImages} label="Product Images" />
          </div>

          {/* Badges */}
          <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5 space-y-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Badges & Flags</p>
            {boolFields.map(({ key, label }) => (
              <label key={key} className="flex cursor-pointer items-center justify-between">
                <span className="text-sm text-gray-600">{label}</span>
                <input type="checkbox" {...register(key as any)} className={checkboxCls} />
              </label>
            ))}
          </div>

          {/* Occasions */}
          <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5 space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Occasions</p>
            <div className="space-y-1.5 max-h-52 overflow-y-auto">
              {occasions.map((o) => (
                <label key={o.id} className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-gray-100 transition-colors">
                  <input type="checkbox" className={checkboxCls} checked={selectedOccasionIds.includes(o.id)} onChange={() => toggleOccasion(o.id)} />
                  <span className="text-sm text-gray-600">{o.name}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Add-Ons */}
          <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5 space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Add-Ons</p>
            <div className="space-y-1.5 max-h-52 overflow-y-auto">
              {existingAddOns.map((a) => (
                <label key={a.id} className="flex cursor-pointer items-center justify-between rounded-lg px-2 py-1.5 hover:bg-gray-100 transition-colors">
                  <div className="flex items-center gap-2">
                    <input type="checkbox" className={checkboxCls} checked={linkedAddOnIds.includes(a.id)} onChange={() => toggleAddOn(a.id)} />
                    <span className="text-sm text-gray-600">{a.name}</span>
                  </div>
                  <span className="text-xs text-gray-400">+₹{a.price}</span>
                </label>
              ))}
              {existingAddOns.length === 0 && (
                <p className="text-xs text-gray-400 py-2 text-center">No add-ons created yet</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}

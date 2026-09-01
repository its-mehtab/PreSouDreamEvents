"use client";

import { useState, useRef } from "react";
import { uploadImage } from "@/lib/actions/upload";
import { toast } from "sonner";
import { Upload, X, ImageIcon, Loader2 } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "motion/react";

interface ImageUploaderProps {
  images: string[];
  onChange: (images: string[]) => void;
  maxImages?: number;
  label?: string;
}

export default function ImageUploader({
  images,
  onChange,
  maxImages = 10,
  label = "Images",
}: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    const remaining = maxImages - images.length;
    const toUpload = Array.from(files).slice(0, remaining);
    if (toUpload.length === 0) {
      toast.error(`Maximum ${maxImages} images allowed`);
      return;
    }

    setUploading(true);
    const uploaded: string[] = [];

    for (const file of toUpload) {
      const formData = new FormData();
      formData.append("file", file);
      const res = await uploadImage(formData);
      if (res.success && res.url) {
        uploaded.push(res.url);
      } else {
        toast.error(`Failed to upload ${file.name}`);
      }
    }

    if (uploaded.length > 0) {
      onChange([...images, ...uploaded]);
      toast.success(`${uploaded.length} image(s) uploaded`);
    }
    setUploading(false);
  }

  function removeImage(url: string) {
    onChange(images.filter((img) => img !== url));
  }

  return (
    <div>
      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">{label}</p>

      <div
        className={cn(
          "relative rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 p-4 transition-colors hover:border-grape-500/40 hover:bg-grape-500/5 cursor-pointer",
          uploading && "pointer-events-none opacity-60"
        )}
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          handleFiles(e.dataTransfer.files);
        }}
      >
        <input
          ref={inputRef}
          type="file"
          multiple
          accept="image/*"
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
        <div className="flex flex-col items-center gap-2 py-2 text-center">
          {uploading ? (
            <Loader2 size={22} className="animate-spin text-grape-400" />
          ) : (
            <Upload size={22} className="text-gray-400" />
          )}
          <p className="text-xs text-gray-400">
            {uploading ? "Uploading..." : "Click or drag & drop images"}
          </p>
          <p className="text-[10px] text-gray-400">
            {images.length}/{maxImages} uploaded
          </p>
        </div>
      </div>

      {/* Preview grid */}
      <div className="mt-3 grid grid-cols-4 gap-2 sm:grid-cols-6">
        <AnimatePresence>
          {images.map((url) => (
            <motion.div
              key={url}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="group relative aspect-square rounded-lg overflow-hidden border border-gray-200 bg-gray-100"
            >
              <Image src={url} alt="Uploaded" fill className="object-cover" sizes="120px" />
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); removeImage(url); }}
                className="absolute right-1 top-1 rounded-full bg-black/60 p-0.5 opacity-0 transition-opacity group-hover:opacity-100 hover:bg-punch-500"
              >
                <X size={10} className="text-gray-900" />
              </button>
            </motion.div>
          ))}
          {images.length === 0 && (
            <div className="flex aspect-square items-center justify-center rounded-lg border border-gray-200 bg-gray-50">
              <ImageIcon size={16} className="text-gray-500" />
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

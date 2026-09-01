"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { User, Phone, Mail, Image as ImageIcon, MapPin, Calendar, CheckSquare } from "lucide-react";
import { updateUser } from "@/lib/actions/auth";
import { toast } from "sonner";
import Link from "next/link";
import Image from "next/image";
import { DatePicker } from "@/components/ui/DatePicker";
import { Select } from "@/components/ui/Select";

export default function EditProfileForm({ 
  initialName, 
  phone,
  initialEmail,
  initialImage,
  initialAddress,
  initialDob,
  initialGender
}: { 
  initialName: string; 
  phone: string;
  initialEmail: string;
  initialImage: string;
  initialAddress: string;
  initialDob: string;
  initialGender: string;
}) {
  const [imagePreview, setImagePreview] = useState(initialImage || "");
  const [dob, setDob] = useState(initialDob || "");
  const [gender, setGender] = useState(initialGender || "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image must be less than 5MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    
    const formData = new FormData(e.currentTarget);
    const res = await updateUser(formData);
    setIsSubmitting(false);
    
    if (res.success) {
      toast.success("Profile updated successfully!");
      router.push("/account");
      router.refresh();
    } else {
      toast.error(res.error || "Failed to update profile");
    }
  }

  const genderOptions = [
    { value: "male", label: "Male" },
    { value: "female", label: "Female" },
    { value: "other", label: "Other" },
    { value: "prefer_not_to_say", label: "Prefer not to say" }
  ];

  return (
    <form onSubmit={handleSubmit} className="mt-5 rounded-2xl border border-ink/10 bg-white p-5 shadow-card space-y-5">
      
      {/* Profile Image Upload */}
      <div className="flex flex-col items-center gap-3 pb-2">
        <div 
          onClick={() => fileInputRef.current?.click()}
          className="relative h-24 w-24 cursor-pointer overflow-hidden rounded-full border-4 border-paper bg-paper shadow-sm flex items-center justify-center text-grape-700 hover:opacity-80 transition-opacity group"
        >
          {imagePreview ? (
            <Image src={imagePreview} alt="Profile" fill className="object-cover" />
          ) : (
            <User size={36} />
          )}
          <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <span className="text-[10px] font-semibold text-white uppercase tracking-wider">Change</span>
          </div>
        </div>
        <input 
          type="file"
          ref={fileInputRef}
          name="image"
          accept="image/*"
          onChange={handleImageChange}
          className="hidden"
        />
        <p className="text-[10px] text-ink/40">Tap to upload local image</p>
      </div>

      <div>
        <label className="mb-1 flex items-center gap-1.5 text-xs font-semibold text-ink/60">
          <User size={13} /> Full Name
        </label>
        <input
          type="text"
          name="name"
          defaultValue={initialName}
          className="input-field"
          placeholder="Enter your name"
          required
        />
      </div>

      <div>
        <label className="mb-1 flex items-center gap-1.5 text-xs font-semibold text-ink/60">
          <Mail size={13} /> Email Address
        </label>
        <input
          type="email"
          name="email"
          defaultValue={initialEmail}
          className="input-field"
          placeholder="your.email@example.com"
        />
      </div>

      <div>
        <label className="mb-1 flex items-center gap-1.5 text-xs font-semibold text-ink/60">
          <Phone size={13} /> Phone Number
        </label>
        <input
          type="text"
          value={phone}
          className="input-field bg-ink/5 text-ink/60 cursor-not-allowed"
          disabled
          readOnly
        />
        <p className="mt-1 text-[10px] text-ink/40">Phone number cannot be changed.</p>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label className="mb-1 flex items-center gap-1.5 text-xs font-semibold text-ink/60">
            <Calendar size={13} /> Date of Birth
          </label>
          <input type="hidden" name="dob" value={dob} />
          <DatePicker 
            value={dob}
            onChange={setDob}
            placeholder="Select date"
          />
        </div>

        <div>
          <label className="mb-1 flex items-center gap-1.5 text-xs font-semibold text-ink/60">
            <CheckSquare size={13} /> Gender
          </label>
          <input type="hidden" name="gender" value={gender} />
          <Select 
            options={genderOptions}
            value={gender}
            onChange={setGender}
            placeholder="Select gender"
          />
        </div>
      </div>

      <div>
        <label className="mb-1 flex items-center gap-1.5 text-xs font-semibold text-ink/60">
          <MapPin size={13} /> Full Address
        </label>
        <textarea
          name="address"
          defaultValue={initialAddress}
          className="input-field resize-none py-3 min-h-[80px]"
          placeholder="Enter your complete delivery address"
        />
      </div>

      <div className="flex items-center justify-end gap-3 pt-4 mt-2 border-t border-ink/5">
        <Link href="/account" className="btn-secondary !px-4 !py-2 text-xs">Cancel</Link>
        <button type="submit" disabled={isSubmitting} className="btn-primary !px-4 !py-2 text-xs">
          {isSubmitting ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </form>
  );
}

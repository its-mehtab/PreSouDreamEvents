import { Palette } from "lucide-react";
import CustomForm from "@/components/forms/CustomForm";

export const metadata = { title: "Custom Decoration — PreSou Dream Events" };

export default function CustomDecorationPage() {
  return (
    <div className="container-app max-w-2xl py-8">
      <span className="flex h-11 w-11 items-center justify-center rounded-full bg-grape-50 text-grape-700">
        <Palette size={20} />
      </span>
      <h1 className="mt-3 font-display text-2xl font-bold sm:text-3xl">Custom Decoration Request</h1>
      <p className="mt-1 text-sm text-ink/55">
        Have a vision that doesn&apos;t fit our standard packages? Tell us about it and we&apos;ll design
        something bespoke for your event.
      </p>

      <CustomForm />
    </div>
  );
}

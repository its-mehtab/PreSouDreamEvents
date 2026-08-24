import Link from "next/link";
import { PartyPopper } from "lucide-react";

export default function NotFound() {
  return (
    <div className="container-app flex flex-col items-center justify-center gap-4 py-28 text-center">
      <PartyPopper size={40} className="text-grape-300" />
      <h1 className="font-display text-3xl font-bold">Page not found</h1>
      <p className="max-w-sm text-sm text-ink/55">
        The page you&apos;re looking for might have moved. Let&apos;s get you back to shopping decorations.
      </p>
      <Link href="/" className="btn-primary">Back to Home</Link>
    </div>
  );
}

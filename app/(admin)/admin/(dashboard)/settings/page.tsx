import type { Metadata } from "next";
import { Settings as SettingsIcon, Bell, Palette, Globe, Shield } from "lucide-react";

export const metadata: Metadata = { title: "Settings" };

export default function SettingsPage() {
  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2"><SettingsIcon size={20} className="text-gray-500" /> Settings</h1>
        <p className="mt-1 text-sm text-gray-500">Manage your store preferences and admin configurations.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Placeholder cards for future settings */}
        <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5 hover:bg-white/[0.05] transition-colors">
          <div className="flex items-center gap-3 mb-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-grape-600/20 text-grape-400">
              <Globe size={18} />
            </div>
            <div>
              <h3 className="font-bold text-gray-900">General Info</h3>
              <p className="text-xs text-gray-500">Store name, contact details</p>
            </div>
          </div>
          <p className="text-sm text-gray-400">Coming soon in v2. Currently configured via environment variables.</p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5 hover:bg-white/[0.05] transition-colors">
          <div className="flex items-center gap-3 mb-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-marigold-400/20 text-marigold-400">
              <Bell size={18} />
            </div>
            <div>
              <h3 className="font-bold text-gray-900">Notifications</h3>
              <p className="text-xs text-gray-500">Email & SMS alerts</p>
            </div>
          </div>
          <p className="text-sm text-gray-400">Coming soon. Setup Twilio/MSG91 keys to enable automated alerts.</p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5 hover:bg-white/[0.05] transition-colors">
          <div className="flex items-center gap-3 mb-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-leaf-500/20 text-leaf-400">
              <Palette size={18} />
            </div>
            <div>
              <h3 className="font-bold text-gray-900">Storefront Display</h3>
              <p className="text-xs text-gray-500">Homepage banners, featured items</p>
            </div>
          </div>
          <p className="text-sm text-gray-400">Dynamic homepage management model to be added in next schema update.</p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5 hover:bg-white/[0.05] transition-colors">
          <div className="flex items-center gap-3 mb-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-punch-500/20 text-punch-400">
              <Shield size={18} />
            </div>
            <div>
              <h3 className="font-bold text-gray-900">Security</h3>
              <p className="text-xs text-gray-500">Sessions, OTP expiry</p>
            </div>
          </div>
          <p className="text-sm text-gray-400">Session expiry is currently hardcoded to 7 days.</p>
        </div>
      </div>
    </div>
  );
}

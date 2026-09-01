import { adminGetAllAdmins } from "@/lib/actions/admin";
import StaffClient from "./StaffClient";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Staff" };

export default async function StaffPage() {
  const staff = await adminGetAllAdmins();
  return <StaffClient staff={staff as any} />;
}

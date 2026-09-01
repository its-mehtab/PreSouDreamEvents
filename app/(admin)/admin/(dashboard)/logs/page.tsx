import { adminGetAuditLogs } from "@/lib/actions/admin";
import LogsClient from "./LogsClient";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Audit Logs" };

export default async function LogsPage() {
  const logs = await adminGetAuditLogs({ limit: 500 });
  return <LogsClient logs={logs as any} />;
}

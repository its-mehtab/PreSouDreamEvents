"use client";

import { useState, useMemo } from "react";
import { format, isToday, isYesterday } from "date-fns";
import { Search, ScrollText, X, ChevronRight, User, Clock, Tag, Hash, FileJson } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "@/lib/utils";

interface AuditLog {
  id: string;
  adminId: string;
  adminPhone: string;
  action: string;
  entity: string;
  entityId: string | null;
  details: any;
  createdAt: string;
}

// ─── Action colour map ────────────────────────────────────────────────────────
function getActionStyle(action: string): { bg: string; text: string; dot: string } {
  const a = action.toUpperCase();
  if (a.startsWith("CREATE")) return { bg: "bg-leaf-500/10", text: "text-leaf-600", dot: "bg-leaf-500" };
  if (a.startsWith("UPDATE") || a.startsWith("UPSERT")) return { bg: "bg-grape-500/10", text: "text-grape-600", dot: "bg-grape-500" };
  if (a.startsWith("DELETE")) return { bg: "bg-punch-500/10", text: "text-punch-600", dot: "bg-punch-500" };
  if (a.startsWith("LOGIN") || a.startsWith("LOGOUT")) return { bg: "bg-marigold-400/10", text: "text-marigold-500", dot: "bg-marigold-400" };
  return { bg: "bg-gray-100", text: "text-gray-600", dot: "bg-gray-400" };
}

function formatDateGroup(dateStr: string) {
  const d = new Date(dateStr);
  if (isToday(d)) return "Today";
  if (isYesterday(d)) return "Yesterday";
  return format(d, "dd MMM yyyy");
}

// ─── Details slide-over panel ─────────────────────────────────────────────────
function DetailPanel({ log, onClose }: { log: AuditLog; onClose: () => void }) {
  const style = getActionStyle(log.action);
  return (
    <motion.div
      initial={{ opacity: 0, x: 32 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 32 }}
      transition={{ type: "spring", damping: 24, stiffness: 280 }}
      className="w-[360px] shrink-0 sticky top-6 h-fit rounded-2xl border border-gray-200 bg-white shadow-lg overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-100 bg-gray-50 px-5 py-4">
        <div className="flex items-center gap-2.5">
          <div className={cn("h-2 w-2 rounded-full", style.dot)} />
          <span className={cn("rounded-lg px-2.5 py-1 text-xs font-bold tracking-wide", style.bg, style.text)}>
            {log.action}
          </span>
        </div>
        <button
          onClick={onClose}
          className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-200 hover:text-gray-700 transition-colors"
        >
          <X size={14} />
        </button>
      </div>

      {/* Body */}
      <div className="p-5 space-y-4">
        <Row icon={<User size={13} />} label="Admin">
          <span className="font-mono text-xs text-gray-700">{log.adminPhone}</span>
          <span className="font-mono text-[10px] text-gray-400 block mt-0.5 truncate">{log.adminId}</span>
        </Row>

        <Row icon={<Tag size={13} />} label="Entity">
          <span className="text-sm font-semibold text-gray-800">{log.entity}</span>
        </Row>

        {log.entityId && (
          <Row icon={<Hash size={13} />} label="Entity ID">
            <span className="font-mono text-xs text-gray-600 break-all">{log.entityId}</span>
          </Row>
        )}

        <Row icon={<Clock size={13} />} label="Timestamp">
          <span className="text-xs text-gray-700">
            {format(new Date(log.createdAt), "dd MMM yyyy, HH:mm:ss")}
          </span>
        </Row>

        <div>
          <div className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-gray-400">
            <FileJson size={12} /> Payload
          </div>
          <pre className="rounded-xl border border-gray-200 bg-gray-50 p-3.5 text-[11px] font-mono text-gray-700 overflow-x-auto whitespace-pre-wrap leading-relaxed max-h-64 overflow-y-auto">
            {JSON.stringify(log.details, null, 2)}
          </pre>
        </div>
      </div>
    </motion.div>
  );
}

function Row({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="mb-1 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-widest text-gray-400">
        {icon} {label}
      </div>
      <div className="pl-[18px]">{children}</div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function LogsClient({ logs }: { logs: AuditLog[] }) {
  const [search, setSearch] = useState("");
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);
  const [actionFilter, setActionFilter] = useState<string>("");

  const filtered = useMemo(() =>
    logs.filter((l) => {
      const matchSearch =
        !search ||
        l.adminPhone.includes(search) ||
        l.action.toLowerCase().includes(search.toLowerCase()) ||
        l.entity.toLowerCase().includes(search.toLowerCase()) ||
        (l.entityId && l.entityId.includes(search));
      const matchAction = !actionFilter || l.action.startsWith(actionFilter);
      return matchSearch && matchAction;
    }),
    [logs, search, actionFilter]
  );

  // Group by date
  const grouped = useMemo(() => {
    const map = new Map<string, AuditLog[]>();
    for (const log of filtered) {
      const key = formatDateGroup(log.createdAt);
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(log);
    }
    return Array.from(map.entries());
  }, [filtered]);

  const ACTION_FILTERS = [
    { label: "All", value: "" },
    { label: "Create", value: "CREATE" },
    { label: "Update", value: "UPDATE" },
    { label: "Delete", value: "DELETE" },
    { label: "Login", value: "LOGIN" },
  ];

  return (
    <div className="space-y-5">
      {/* Page header */}
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="flex items-center gap-2.5 text-xl font-bold text-gray-900">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-grape-100">
              <ScrollText size={15} className="text-grape-600" />
            </div>
            Audit Logs
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            {filtered.length} of {logs.length} log entries
          </p>
        </div>

        {/* Action filter pills */}
        <div className="flex flex-wrap gap-1.5">
          {ACTION_FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => setActionFilter(f.value)}
              className={cn(
                "rounded-xl px-3 py-1.5 text-xs font-semibold transition-colors",
                actionFilter === f.value
                  ? "bg-grape-600 text-white shadow-sm"
                  : "bg-gray-100 text-gray-500 hover:bg-gray-200"
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search phone, action, entity, or ID…"
          className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-sm text-gray-900 placeholder-gray-400 shadow-sm outline-none transition focus:border-grape-400 focus:ring-2 focus:ring-grape-200"
        />
        {search && (
          <button
            onClick={() => setSearch("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-0.5 text-gray-400 hover:text-gray-700 transition-colors"
          >
            <X size={13} />
          </button>
        )}
      </div>

      {/* Content */}
      <div className="flex gap-5 items-start">
        {/* Log list */}
        <div className="flex-1 min-w-0 space-y-6">
          {grouped.length === 0 ? (
            <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-gray-200 py-20 text-center">
              <ScrollText size={36} className="text-gray-300" />
              <p className="text-sm font-medium text-gray-400">No logs match your search</p>
            </div>
          ) : (
            grouped.map(([dateLabel, dayLogs]) => (
              <div key={dateLabel}>
                {/* Date group header */}
                <div className="mb-3 flex items-center gap-3">
                  <span className="text-xs font-bold uppercase tracking-widest text-gray-400">{dateLabel}</span>
                  <div className="flex-1 border-t border-gray-200" />
                  <span className="text-[10px] text-gray-400">{dayLogs.length} events</span>
                </div>

                {/* Timeline rows */}
                <div className="relative space-y-0 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
                  {dayLogs.map((log, idx) => {
                    const style = getActionStyle(log.action);
                    const isSelected = selectedLog?.id === log.id;
                    return (
                      <motion.button
                        key={log.id}
                        type="button"
                        layout
                        onClick={() => setSelectedLog(isSelected ? null : log)}
                        className={cn(
                          "group w-full flex items-center gap-4 px-5 py-3.5 text-left transition-colors border-b border-gray-100 last:border-0",
                          isSelected
                            ? "bg-grape-50"
                            : "hover:bg-gray-50"
                        )}
                      >
                        {/* Action dot */}
                        <div className="flex flex-col items-center gap-1 shrink-0">
                          <div className={cn("h-2 w-2 rounded-full ring-2 ring-white", style.dot)} />
                          {idx < dayLogs.length - 1 && (
                            <div className="w-px flex-1 bg-gray-200 h-3" />
                          )}
                        </div>

                        {/* Time */}
                        <span className="w-16 shrink-0 font-mono text-[11px] text-gray-400">
                          {format(new Date(log.createdAt), "HH:mm:ss")}
                        </span>

                        {/* Admin phone */}
                        <span className="w-32 shrink-0 font-mono text-xs text-gray-500 truncate">
                          {log.adminPhone}
                        </span>

                        {/* Action badge */}
                        <span className={cn(
                          "shrink-0 rounded-lg px-2.5 py-0.5 text-[10px] font-bold tracking-wide",
                          style.bg, style.text
                        )}>
                          {log.action}
                        </span>

                        {/* Entity */}
                        <span className="flex-1 truncate text-xs text-gray-600">
                          {log.entity}
                          {log.entityId && (
                            <span className="ml-1.5 font-mono text-[10px] text-gray-400">
                              #{log.entityId.slice(-8)}
                            </span>
                          )}
                        </span>

                        {/* Chevron */}
                        <ChevronRight
                          size={14}
                          className={cn(
                            "shrink-0 transition-all text-gray-300",
                            isSelected
                              ? "rotate-90 text-grape-400"
                              : "group-hover:text-gray-500"
                          )}
                        />
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Detail panel */}
        <AnimatePresence>
          {selectedLog && (
            <DetailPanel
              key={selectedLog.id}
              log={selectedLog}
              onClose={() => setSelectedLog(null)}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

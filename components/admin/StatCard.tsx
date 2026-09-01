import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ElementType;
  accent?: "grape" | "leaf" | "marigold" | "punch" | "blue";
  trend?: { value: number; label: string };
}

const ACCENT_MAP = {
  grape: {
    icon: "bg-grape-100 text-grape-600",
    glow: "from-grape-500/8 to-transparent",
    bar: "bg-grape-600",
    border: "border-grape-200/60",
  },
  leaf: {
    icon: "bg-leaf-500/10 text-leaf-600",
    glow: "from-leaf-500/8 to-transparent",
    bar: "bg-leaf-500",
    border: "border-leaf-500/20",
  },
  marigold: {
    icon: "bg-marigold-400/10 text-marigold-500",
    glow: "from-marigold-400/8 to-transparent",
    bar: "bg-marigold-400",
    border: "border-marigold-400/20",
  },
  punch: {
    icon: "bg-punch-500/10 text-punch-500",
    glow: "from-punch-500/8 to-transparent",
    bar: "bg-punch-500",
    border: "border-punch-500/20",
  },
  blue: {
    icon: "bg-blue-500/10 text-blue-500",
    glow: "from-blue-500/8 to-transparent",
    bar: "bg-blue-500",
    border: "border-blue-200/60",
  },
};

export default function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  accent = "grape",
  trend,
}: StatCardProps) {
  const a = ACCENT_MAP[accent];
  return (
    <div className={cn(
      "relative overflow-hidden rounded-2xl border bg-white p-5 shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5",
      a.border
    )}>
      {/* Subtle gradient glow top-right */}
      <div className={cn("pointer-events-none absolute -right-4 -top-4 h-24 w-24 rounded-full bg-gradient-radial opacity-60", a.glow)} />

      <div className="relative flex items-start justify-between">
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">{title}</p>
          <p className="mt-2 text-2xl font-bold tracking-tight text-gray-900 leading-none">{value}</p>
          {subtitle && <p className="mt-1.5 text-xs text-gray-500">{subtitle}</p>}
        </div>
        <div className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-xl shadow-sm", a.icon)}>
          <Icon size={19} strokeWidth={1.8} />
        </div>
      </div>

      {trend !== undefined && (
        <div className="relative mt-4 flex items-center gap-1.5 text-xs">
          {trend.value > 0 ? (
            <TrendingUp size={12} className="text-leaf-500" />
          ) : trend.value < 0 ? (
            <TrendingDown size={12} className="text-punch-500" />
          ) : (
            <Minus size={12} className="text-gray-400" />
          )}
          <span className={cn(
            "font-bold",
            trend.value > 0 ? "text-leaf-500" : trend.value < 0 ? "text-punch-500" : "text-gray-400"
          )}>
            {trend.value > 0 ? "+" : ""}{trend.value}%
          </span>
          <span className="text-gray-400">{trend.label}</span>
        </div>
      )}

      {/* Bottom accent line */}
      <div className={cn("absolute bottom-0 left-0 h-[3px] w-full opacity-40", a.bar)} />
    </div>
  );
}

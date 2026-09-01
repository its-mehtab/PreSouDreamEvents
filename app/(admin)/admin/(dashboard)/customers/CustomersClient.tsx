"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { 
  Search, Users, UserPlus, Crown, Download,
  RotateCcw, MapPin, MoreVertical,
  ChevronDown, ChevronLeft, ChevronRight
} from "lucide-react";
import { format } from "date-fns";
import { AnimatePresence, motion } from "motion/react";
import { formatPrice } from "@/lib/utils";
import { toast } from "sonner";

interface Customer {
  id: string;
  name?: string;
  phone: string;
  email?: string;
  createdAt: string;
  gender?: string;
  address?: string;
  disabled?: boolean;
  _count: { bookings: number; reviews: number };
  bookings: { totalPrice: number; status: string }[];
}

const DropdownFilter = ({ 
  label, 
  value, 
  options, 
  isOpen, 
  onToggle, 
  onChange 
}: { 
  label: string; 
  value: string; 
  options: { label: string; value: string }[]; 
  isOpen: boolean; 
  onToggle: () => void; 
  onChange: (val: string) => void;
}) => (
  <div className="relative">
    <button 
      onClick={onToggle}
      className="flex items-center justify-between gap-3 rounded-xl border border-gray-200 bg-white px-3 py-1.5 text-[13px] text-gray-600 hover:bg-gray-50 min-w-[140px] whitespace-nowrap"
    >
      <span className="truncate">{options.find(o => o.value === value)?.label || label}</span>
      <ChevronDown size={12} className="text-gray-400 shrink-0" />
    </button>
    {isOpen && (
      <>
        <div className="fixed inset-0 z-10" onClick={onToggle} />
        <div className="absolute top-full left-0 mt-1 w-48 rounded-xl border border-gray-100 bg-white shadow-lg z-20 py-1 max-h-60 overflow-y-auto">
          {options.map((opt) => (
            <button
              key={opt.value}
              onClick={() => { onChange(opt.value); onToggle(); }}
              className={`w-full text-left px-4 py-2 text-[13px] hover:bg-gray-50 ${value === opt.value ? 'text-grape-700 font-medium bg-grape-50/50' : 'text-gray-700'}`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </>
    )}
  </div>
);

export default function CustomersClient({ customers }: { customers: Customer[] }) {
  const router = useRouter();
  
  // States
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [locationFilter, setLocationFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  
  // Computed locations for dropdown
  const uniqueLocations = useMemo(() => {
    const locs = new Set<string>();
    customers.forEach(c => locs.add(c.address || "Kolkata, WB"));
    return Array.from(locs).sort();
  }, [customers]);

  const locationOptions = [
    { label: "All Locations", value: "all" },
    ...uniqueLocations.map(l => ({ label: l, value: l }))
  ];

  const statusOptions = [
    { label: "All Status", value: "all" },
    { label: "Active", value: "active" },
    { label: "Inactive", value: "inactive" }
  ];

  const dateOptions = [
    { label: "Joined: All Time", value: "all" },
    { label: "Last 7 Days", value: "7d" },
    { label: "Last 30 Days", value: "30d" },
    { label: "This Year", value: "year" }
  ];

  // Handlers
  const handleReset = () => {
    setSearch("");
    setStatusFilter("all");
    setLocationFilter("all");
    setDateFilter("all");
    setCurrentPage(1);
  };
  
  const handleExport = () => {
    toast.success("Exporting customers to CSV...");
  };

  const toggleDropdown = (name: string) => {
    setOpenDropdown(prev => prev === name ? null : name);
  };

  // Derived state
  const filtered = useMemo(() => {
    return customers.filter((c) => {
      const matchesSearch = !search || 
        c.phone.includes(search) || 
        (c.name ?? "").toLowerCase().includes(search.toLowerCase()) || 
        (c.email ?? "").toLowerCase().includes(search.toLowerCase());
      
      const matchesStatus = statusFilter === "all" || 
        (statusFilter === "active" && !c.disabled) || 
        (statusFilter === "inactive" && c.disabled);
      
      const customerLocation = c.address || "Kolkata, WB";
      const matchesLocation = locationFilter === "all" || customerLocation === locationFilter;
      
      let matchesDate = true;
      if (dateFilter !== "all") {
        const createdDate = new Date(c.createdAt);
        const now = new Date();
        if (dateFilter === "7d") {
          matchesDate = (now.getTime() - createdDate.getTime()) <= 7 * 24 * 60 * 60 * 1000;
        } else if (dateFilter === "30d") {
          matchesDate = (now.getTime() - createdDate.getTime()) <= 30 * 24 * 60 * 60 * 1000;
        } else if (dateFilter === "year") {
          matchesDate = createdDate.getFullYear() === now.getFullYear();
        }
      }
        
      return matchesSearch && matchesStatus && matchesLocation && matchesDate;
    });
  }, [customers, search, statusFilter, locationFilter, dateFilter]);

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const totalSpentAll = customers.reduce((acc, c) => {
    return acc + c.bookings.reduce((sum, b) => (b.status !== "CANCELLED" ? sum + b.totalPrice : sum), 0);
  }, 0);

  return (
    <div className="space-y-6 pb-10">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Customers</h1>
          <p className="text-[13px] text-gray-500 mt-0.5">Manage and view all your customers in one place.</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={handleExport} className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2 text-[13px] font-medium text-grape-700 hover:bg-gray-50 transition shadow-sm">
            <Download size={14} /> Export
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Customers */}
        <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm flex gap-3 items-start">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
            <Users size={16} />
          </div>
          <div>
            <p className="text-[12px] font-medium uppercase tracking-wider text-gray-500">Total Customers</p>
            <p className="text-xl font-bold text-gray-900 mt-0.5">{customers.length}</p>
            <p className="text-[11px] font-medium text-green-600 mt-0.5 flex items-center gap-1">
              ↑ 12% vs last month
            </p>
          </div>
        </div>
        {/* New Customers */}
        <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm flex gap-3 items-start">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-green-50 text-green-600">
            <UserPlus size={16} />
          </div>
          <div>
            <p className="text-[12px] font-medium uppercase tracking-wider text-gray-500">New Customers</p>
            <p className="text-xl font-bold text-gray-900 mt-0.5">{Math.floor(customers.length * 0.15) || 5}</p>
            <p className="text-[11px] font-medium text-green-600 mt-0.5 flex items-center gap-1">
              ↑ 8% vs last month
            </p>
          </div>
        </div>
        {/* Repeat Customers */}
        <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm flex gap-3 items-start">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-orange-500">
            <Crown size={16} />
          </div>
          <div>
            <p className="text-[12px] font-medium uppercase tracking-wider text-gray-500">Repeat Customers</p>
            <p className="text-xl font-bold text-gray-900 mt-0.5">{Math.floor(customers.length * 0.4) || 2}</p>
            <p className="text-[11px] font-medium text-green-600 mt-0.5 flex items-center gap-1">
              ↑ 16% vs last month
            </p>
          </div>
        </div>
        {/* Total Spent */}
        <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm flex gap-3 items-start">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-500">
            <span className="font-sans text-base font-bold">₹</span>
          </div>
          <div>
            <p className="text-[12px] font-medium uppercase tracking-wider text-gray-500">Total Spent</p>
            <p className="text-xl font-bold text-gray-900 mt-0.5">{formatPrice(totalSpentAll).replace('₹', '')}</p>
            <p className="text-[11px] font-medium text-green-600 mt-0.5 flex items-center gap-1">
              ↑ 18% vs last month
            </p>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden flex flex-col">
        
        {/* Filters Bar */}
        <div className="p-3 border-b border-gray-100 flex flex-col lg:flex-row lg:items-center justify-between gap-3 bg-white">
          <div className="relative w-full lg:w-72 shrink-0">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={search}
              onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
              placeholder="Search customers..."
              className="w-full rounded-xl border border-gray-200 bg-white py-1.5 pl-9 pr-3 text-[13px] text-gray-900 placeholder-gray-400 outline-none focus:border-grape-500/50 transition-colors"
            />
          </div>
          <div className="flex items-center gap-2 overflow-x-visible pb-1 lg:pb-0 hide-scrollbar flex-1 w-full lg:justify-end">
            <DropdownFilter
              label="All Status"
              value={statusFilter}
              options={statusOptions}
              isOpen={openDropdown === 'status'}
              onToggle={() => toggleDropdown('status')}
              onChange={(v) => { setStatusFilter(v); setCurrentPage(1); }}
            />
            <DropdownFilter
              label="All Locations"
              value={locationFilter}
              options={locationOptions}
              isOpen={openDropdown === 'location'}
              onToggle={() => toggleDropdown('location')}
              onChange={(v) => { setLocationFilter(v); setCurrentPage(1); }}
            />
            <DropdownFilter
              label="Joined: All Time"
              value={dateFilter}
              options={dateOptions}
              isOpen={openDropdown === 'date'}
              onToggle={() => toggleDropdown('date')}
              onChange={(v) => { setDateFilter(v); setCurrentPage(1); }}
            />
            <div className="w-px h-5 bg-gray-200 mx-1 hidden lg:block shrink-0"></div>
            <button onClick={handleReset} className="flex items-center gap-1.5 rounded-xl bg-white px-3 py-1.5 text-[13px] font-medium text-gray-500 hover:text-gray-900 transition-colors shrink-0">
              <RotateCcw size={12} /> Reset
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs whitespace-nowrap">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50 text-left">
                <th className="px-5 py-3 font-bold uppercase tracking-wider text-gray-400 text-[11px]">Customer</th>
                <th className="px-5 py-3 font-bold uppercase tracking-wider text-gray-400 text-[11px]">Contact</th>
                <th className="px-5 py-3 font-bold uppercase tracking-wider text-gray-400 text-[11px]">Location</th>
                <th className="px-5 py-3 font-bold uppercase tracking-wider text-gray-400 text-[11px] text-center">Total Bookings</th>
                <th className="px-5 py-3 font-bold uppercase tracking-wider text-gray-400 text-[11px] text-right">Total Spent</th>
                <th className="px-5 py-3 font-bold uppercase tracking-wider text-gray-400 text-[11px] text-center">Status</th>
                <th className="px-5 py-3 font-bold uppercase tracking-wider text-gray-400 text-[11px]">Joined On</th>
                <th className="px-5 py-3 font-bold uppercase tracking-wider text-gray-400 text-[11px] text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {paginated.length === 0 && (
                  <tr><td colSpan={8} className="py-12 text-center text-xs text-gray-400">No customers found matching your filters.</td></tr>
                )}
                {paginated.map((c) => {
                  const customerSpent = c.bookings.reduce((sum, b) => (b.status !== "CANCELLED" ? sum + b.totalPrice : sum), 0);
                  return (
                    <motion.tr
                      key={c.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors cursor-pointer group"
                      onClick={() => router.push(`/admin/customers/${c.id}`)}
                    >
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                            c.disabled ? 'bg-red-50 text-red-600' : 'bg-grape-100 text-grape-700'
                          }`}>
                            {(c.name || c.phone).charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900 group-hover:text-grape-700 transition-colors text-xs">{c.name || "Unknown"}</p>
                            <p className="text-[12px] text-gray-400 mt-0.5">#CUST-{c.id.slice(-5).toUpperCase()}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3">
                        <p className="text-[13px] font-medium text-gray-700">+91 {c.phone.replace('+91', '').trim()}</p>
                        <p className="text-[12px] text-gray-400 mt-0.5">{c.email || "—"}</p>
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-1.5 text-[13px] text-gray-500">
                          <MapPin size={12} className="text-gray-400" />
                          <span>{c.address || "Kolkata, WB"}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3 text-center">
                        <span className="text-xs font-semibold text-gray-700">{c._count.bookings}</span>
                      </td>
                      <td className="px-5 py-3 text-right">
                        <span className="text-xs font-semibold text-gray-900">{formatPrice(customerSpent)}</span>
                      </td>
                      <td className="px-5 py-3 text-center">
                        {c.disabled ? (
                          <span className="inline-flex rounded-full bg-red-50 px-2.5 py-0.5 text-[11px] font-semibold text-red-600">
                            Inactive
                          </span>
                        ) : (
                          <span className="inline-flex rounded-full bg-green-50 px-2.5 py-0.5 text-[11px] font-semibold text-green-600">
                            Active
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-3 text-[13px] text-gray-500">
                        {format(new Date(c.createdAt), "dd MMM, yyyy")}
                      </td>
                      <td className="px-5 py-3 text-center">
                        <button 
                          onClick={(e) => { 
                            e.stopPropagation(); 
                            router.push(`/admin/customers/${c.id}`);
                          }}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
                        >
                          <MoreVertical size={14} />
                        </button>
                      </td>
                    </motion.tr>
                  );
                })}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {/* Footer Pagination */}
        {filtered.length > 0 && (
          <div className="p-3 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3 bg-gray-50/30">
            <p className="text-[13px] font-medium text-gray-500">
              Showing <span className="font-semibold text-gray-700">{(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filtered.length)}</span> of {filtered.length} customers
            </p>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => {
                  setItemsPerPage(itemsPerPage === 10 ? 25 : 10);
                  setCurrentPage(1);
                }}
                className="flex items-center justify-between gap-2 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-[13px] text-gray-600 hover:bg-gray-50"
              >
                {itemsPerPage} per page <ChevronDown size={12} className="text-gray-400" />
              </button>
              <div className="flex items-center gap-1 ml-2">
                <button 
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  className="p-1.5 rounded-md border border-gray-200 bg-white text-gray-400 hover:text-gray-700 disabled:opacity-50 transition-colors"
                >
                  <ChevronLeft size={14} />
                </button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }).map((_, i) => (
                    <button 
                      key={i}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`w-7 h-7 rounded-md text-[13px] font-semibold flex items-center justify-center transition-colors ${
                        currentPage === i + 1 
                          ? 'bg-grape-600 text-white' 
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
                <button 
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  className="p-1.5 rounded-md border border-gray-200 bg-white text-gray-600 hover:text-gray-900 disabled:opacity-50 transition-colors"
                >
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

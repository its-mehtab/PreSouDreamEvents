import { getSession } from "@/lib/auth/session";
import { redirect } from "next/navigation";
import AdminSidebar from "@/components/admin/Sidebar";
import AdminTopbar from "@/components/admin/Topbar";
import prisma from "@/lib/prisma";

export default async function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session || (session.role !== "ADMIN" && session.role !== "SUPER_ADMIN")) {
    redirect("/admin/login");
  }

  const dbUser = await prisma.user.findUnique({
    where: { id: session.userId },
    select: { name: true },
  });

  return (
    <div className="flex h-screen overflow-hidden">
      <AdminSidebar role={session.role} />
      <div className="flex flex-1 flex-col overflow-hidden">
        <AdminTopbar phone={session.phone} role={session.role} name={dbUser?.name} />
        <main className="flex-1 overflow-y-auto bg-gray-50 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}

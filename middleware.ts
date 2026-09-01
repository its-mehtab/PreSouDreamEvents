import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { decrypt } from "@/lib/auth/session";

const protectedCustomerRoutes = ["/checkout", "/account", "/wishlist"];
const protectedAdminRoutes = ["/admin"];
const publicAdminRoutes = ["/admin/login"];

export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;

  const isCustomerRoute = protectedCustomerRoutes.some((route) => path.startsWith(route));
  const isAdminRoute = protectedAdminRoutes.some((route) => path.startsWith(route));
  const isPublicAdminRoute = publicAdminRoutes.some((route) => path === route);

  // Let public admin routes (login page) through
  if (isPublicAdminRoute) return NextResponse.next();

  // Note: For public routes, let them pass
  if (!isCustomerRoute && !isAdminRoute) {
    return NextResponse.next();
  }

  // Check auth
  const sessionCookie = req.cookies.get("session")?.value;
  const session = await decrypt(sessionCookie);

  if (!session) {
    // Unauthenticated
    if (isAdminRoute) {
      return NextResponse.redirect(new URL("/admin/login", req.nextUrl));
    }
    const redirectUrl = new URL("/login", req.nextUrl);
    redirectUrl.searchParams.set("callbackUrl", path);
    return NextResponse.redirect(redirectUrl);
  }

  // Role Based Access Control
  if (isAdminRoute && session.role !== "ADMIN" && session.role !== "SUPER_ADMIN") {
    // Customer trying to access admin
    return NextResponse.redirect(new URL("/", req.nextUrl));
  }

  // Allowed
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)", "/favicon.ico"],
};

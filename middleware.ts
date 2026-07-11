// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const PROTECTED_ROUTES = ["/dashboard", "/admin", "/admin/projects"];
const ADMIN_ROUTES = ["/dashboard", "/admin", "/admin/projects"];
const PUBLIC_ROUTES = [
  "/home",
  "/project",
  "/contact",
  "/login",
  "/api/auth",
  "/_next",
  "/favicon.ico",
  "/uploads",
];

function isProtectedRoute(pathname: string): boolean {
  return PROTECTED_ROUTES.some((route) => pathname.startsWith(route));
}

function isAdminRoute(pathname: string): boolean {
  return ADMIN_ROUTES.some((route) => pathname.startsWith(route));
}

function isPublicRoute(pathname: string): boolean {
  if (pathname === "/") return true; // exact match aja buat root
  return PUBLIC_ROUTES.some((route) => pathname.startsWith(route));
}

function isApiRoute(pathname: string): boolean {
  return pathname.startsWith("/api");
}

export async function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;

  console.log(`[Middleware] ${pathname}`);

  // Bypass API & public routes
  if (isApiRoute(pathname) || isPublicRoute(pathname)) {
    return NextResponse.next();
  }

  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const isAuthenticated = !!token;
  const role = token?.role || "user";

  // 🔒 Proteksi route yang butuh login
  if (isProtectedRoute(pathname) && !isAuthenticated) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("callbackUrl", pathname + search);
    console.log(`[Middleware] Redirect ke login: ${loginUrl}`);
    return NextResponse.redirect(loginUrl);
  }

  // 🛡️ Proteksi admin-only routes
  if (isAdminRoute(pathname) && role !== "admin") {
    console.log(`[Middleware] Role ${role} bukan admin, redirect ke /`);
    return NextResponse.redirect(new URL("/", req.url));
  }

  // 🔄 Redirect dari /login jika sudah login
  if (pathname === "/login" && isAuthenticated) {
    const redirectTo = role === "admin" ? "/dashboard" : "/";
    console.log(`[Middleware] Sudah login, redirect ke ${redirectTo}`);
    return NextResponse.redirect(new URL(redirectTo, req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*", "/projects/:path*", "/login"],
};

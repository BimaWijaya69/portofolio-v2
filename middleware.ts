// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });
  console.log("Full Token:", JSON.stringify(token, null, 2));
  // Decode manual untuk dapetin role
  let role = "user";
  if (token) {
    // Token dari getToken() itu sebenarnya JWT yang sudah didecode
    // Coba akses langsung
    role = (token as any).role || "user";
  }

  const { pathname, search } = req.nextUrl;

  console.log("Middleware - Role:", role); // Debug

  if (pathname.startsWith("/dashboard")) {
    if (!token) {
      const loginUrl = new URL("/login", req.url);
      loginUrl.searchParams.set("callbackUrl", `/dashboard${search}`);
      return NextResponse.redirect(loginUrl);
    }

    if (role !== "admin") {
      return NextResponse.redirect(new URL("/home", req.url));
    }
  }

  if (pathname === "/login" && token) {
    if (role === "admin") {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
    return NextResponse.redirect(new URL("/home", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/login"],
};

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const secret = process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET || "dev_change_me";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow access to login page
  if (pathname === "/admin/login") {
    // If already authenticated, redirect based on role
    const token = await getToken({ req: request, secret });
    if (token) {
      const role = (token as any).role;
      if (role === "super_admin") {
        return NextResponse.redirect(new URL("/super-admin", request.url));
      } else if (role === "admin") {
        return NextResponse.redirect(new URL("/admin", request.url));
      } else {
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }
    }
    return NextResponse.next();
  }

  // Protect /super-admin routes - only super admins
  if (pathname.startsWith("/super-admin")) {
    const token = await getToken({ req: request, secret });
    
    if (!token) {
      console.log("Super admin route: No token found, redirecting to checkout");
      return NextResponse.redirect(new URL("/checkout", request.url));
    }
    
    const role = (token as any).role;
    console.log("Super admin route: Token found, role:", role);
    
    if (role !== "super_admin") {
      console.log("Super admin route: Role mismatch, redirecting");
      // Redirect non-super-admins to their appropriate dashboard
      if (role === "admin") {
        return NextResponse.redirect(new URL("/admin", request.url));
      } else {
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }
    }
    
    console.log("Super admin route: Access granted");
  }

  // Protect /admin routes - admins and super admins only
  if (pathname.startsWith("/admin")) {
    const token = await getToken({ req: request, secret });
    
    if (!token) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
    
    const role = (token as any).role;
    if (role !== "admin" && role !== "super_admin") {
      // Redirect customers to their dashboard
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  // Protect /dashboard routes - any authenticated user
  if (pathname.startsWith("/dashboard")) {
    const token = await getToken({ req: request, secret });
    
    if (!token) {
      return NextResponse.redirect(new URL("/checkout", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/dashboard/:path*",
    "/super-admin(.*)",
  ],
};


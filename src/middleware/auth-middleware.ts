import { NextResponse, type NextRequest } from "next/server";

export function authMiddleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const isLoggedIn = req.cookies.get("auth-token");

  // 🚨 Si no está logueado e intenta entrar a cualquier ruta de dashboard (incluye /dashboard/default)
  if (!isLoggedIn && pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  // 🚨 Si ya está logueado e intenta entrar al login, redirigimos al dashboard
  if (isLoggedIn && pathname === "/auth/login") {
    return NextResponse.redirect(new URL("/dashboard/default", req.url));
  }

  return NextResponse.next();
}

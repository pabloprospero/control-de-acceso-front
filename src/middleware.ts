import { NextResponse, type NextRequest } from "next/server";

export default function authMiddleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const isLoggedIn = req.cookies.get("token");
  console.log("Middleware - isLoggedIn:", isLoggedIn);

  if (!isLoggedIn && pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/auth/v1/login", req.url));
  }

  if (isLoggedIn && pathname === "/auth/v1/login") {
    return NextResponse.redirect(new URL("/dashboard/default", req.url));
  }

  return NextResponse.next();
}

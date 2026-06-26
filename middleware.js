import { NextResponse } from "next/server";

const PROTECTED = [
  "/editor", "/institutes", "/students", "/editors",
  "/licenses", "/courses", "/sessions", "/analytics",
  "/content", "/profile",
];

export function middleware(request) {
  const { pathname } = request.nextUrl;
  const isProtected = PROTECTED.some((p) => pathname.startsWith(p));
  if (!isProtected) return NextResponse.next();

  const token =
    request.cookies.get("token")?.value ||
    request.cookies.get("editor_token")?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/admin-login", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/editor/:path*", "/institutes/:path*", "/students/:path*",
    "/editors/:path*", "/licenses/:path*", "/courses/:path*",
    "/sessions/:path*", "/analytics/:path*", "/content/:path*",
    "/profile/:path*",
  ],
};

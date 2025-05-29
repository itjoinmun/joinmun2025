// middleware.ts
import { NextResponse, type NextRequest } from "next/server";

const AUTH_ROUTES = ["/login", "/register"];
const PROTECTED_ROUTES = ["/dashboard"];

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("access_token")?.value;
  const url = request.nextUrl.clone();
  const pathname = request.nextUrl.pathname;

  if (token && AUTH_ROUTES.some((route) => pathname.startsWith(route))) {
    url.pathname = "/dashboard/home";
    return NextResponse.redirect(url);
  }

  if (!token && PROTECTED_ROUTES.some((route) => pathname.startsWith(route))) {
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }
}

// Configure which paths the middleware runs on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|favicon.png|sitemap.xml|robots.txt).*)",
  ],
};

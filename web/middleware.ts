import { refreshToken } from "@/utils/actions/auth-handler";
import { NextResponse, type NextRequest } from "next/server";

const AUTH_ROUTES = ["/login", "/register"];
const GUEST_ROUTES = ["/", "/theme"];
const PROTECTED_ROUTES = ["/dashboard"];

export async function middleware(request: NextRequest) {
  const access = request.cookies.get("access_token");
  const refresh = request.cookies.get("refresh_token")?.value;
  const url = request.nextUrl.clone();
  const pathname = request.nextUrl.pathname;

  const isAuthRoute = AUTH_ROUTES.some((route) => pathname.startsWith(route));
  const isGuestRoute = GUEST_ROUTES.some((route) => pathname === route);
  const isProtectedRoute = PROTECTED_ROUTES.some((route) => pathname.startsWith(route));

  if (!access) {
    try {
      await refreshToken();
    } catch (error) {
      console.error("Failed to refresh token in middleware:", error);
      if (isProtectedRoute) {
        url.pathname = "/login";
        return NextResponse.redirect(url);
      }
    }
  }

  if (refresh) {
    if (isAuthRoute || isGuestRoute) {
      url.pathname = "/dashboard/delegates";
      return NextResponse.redirect(url);
    }
  } else {
    if (isProtectedRoute) {
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }
  }

  // If no redirection happened, allow the request to continue
  return NextResponse.next();
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
    "/((?!api|_next/static|_next/image|favicon.ico|favicon.png|sitemap.xml|robots.txt|.*\\.png).*)",
  ],
};

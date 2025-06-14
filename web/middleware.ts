import { parseTokensFromHeaders } from "@/utils/helpers/fetch/headers";
import { NextResponse, type NextRequest } from "next/server";

const AUTH_ROUTES = ["/login", "/register"];
const GUEST_ROUTES = ["/", "/theme"];
const PROTECTED_ROUTES = ["/dashboard"];
const ADMIN_ROUTES = ["/admin"];

export async function middleware(request: NextRequest) {
  const access = request.cookies.get("access_token")?.value;
  const refresh = request.cookies.get("refresh_token")?.value;
  const url = request.nextUrl.clone();
  const pathname = request.nextUrl.pathname;

  const isAuthRoute = AUTH_ROUTES.some((route) => pathname.startsWith(route));
  const isGuestRoute = GUEST_ROUTES.some((route) => pathname === route);
  const isProtectedRoute = PROTECTED_ROUTES.some((route) => pathname.startsWith(route));
  const isAdminRoute = ADMIN_ROUTES.some((route) => pathname.startsWith(route));

  if (isAdminRoute) {
    if (!access && !refresh) {
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }

    try {
      const res = await fetch(`${process.env.API_URL}/auth/me`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Cookie: `access_token=${access}`,
        },
      });

      if (!res.ok) {
        url.pathname = "/login";
        return NextResponse.redirect(url);
      }

      const data = await res.json();
      if (data.user.Role !== "admin") {
        url.pathname = "/dashboard/home";
        return NextResponse.redirect(url);
      }
    } catch (error) {
      console.error("Failed to verify admin access:", error);
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }
  }

  let hasValidSession = Boolean(access || refresh);

  if (!access && refresh) {
    try {
      const response = await refreshTokenMiddleware(request);
      if (response) {
        hasValidSession = true;

        if (isAuthRoute || isGuestRoute) {
          url.pathname = "/dashboard/home";
          return NextResponse.redirect(url);
        }

        return response;
      }
    } catch (error) {
      console.error("Failed to refresh token in middleware:", error);
      hasValidSession = false;
      if (isProtectedRoute) {
        url.pathname = "/login";
        return NextResponse.redirect(url);
      }
    }
  }

  if (hasValidSession) {
    if (isAuthRoute || isGuestRoute) {
      url.pathname = "/dashboard/home";
      return NextResponse.redirect(url);
    }
  } else {
    if (isProtectedRoute) {
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

const refreshTokenMiddleware = async (request: NextRequest) => {
  const refresh = request.cookies.get("refresh_token")?.value;
  const originalUrl = request.nextUrl.clone();
  if (!refresh) {
    throw new Error("No refresh token available");
  }

  const response = NextResponse.redirect(originalUrl);

  try {
    const res = await fetch(`${process.env.API_URL}/user/refresh`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Cookie: `refresh_token=${refresh}`,
      },
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Failed to refresh access token");
    }

    const { accessToken, refreshToken } = parseTokensFromHeaders(res.headers);

    if (!accessToken || !refreshToken) {
      throw new Error("Failed to retrieve tokens from response headers");
    }

    response.cookies.set({
      name: "access_token",
      domain: accessToken.domain,
      value: accessToken.value,
      path: accessToken.path,
      maxAge: accessToken.maxAge || 3600,
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });

    response.cookies.set({
      name: "refresh_token",
      domain: refreshToken.domain,
      value: refreshToken.value,
      path: refreshToken.path,
      maxAge: refreshToken.maxAge || 2592000,
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });

    return response;
  } catch (error) {
    console.error("Failed to refresh token in middleware:", error);
    response.cookies.delete("refresh_token");
    response.cookies.delete("access_token");
    return response;
  }
};

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

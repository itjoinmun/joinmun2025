import { parseTokensFromHeaders } from "@/utils/helpers/fetch/headers";
import { NextResponse, type NextRequest } from "next/server";

const AUTH_ROUTES = ["/login", "/register"];
const GUEST_ROUTES = ["/", "/theme"];
const PROTECTED_ROUTES = ["/dashboard"];
const ADMIN_ROUTES = ["/admin"];

// Main Middleware Function
export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const access = request.cookies.get("access_token")?.value;
    const refresh = request.cookies.get("refresh_token")?.value;
    const url = request.nextUrl.clone();

    const isAuthRoute = AUTH_ROUTES.some((route) => pathname.startsWith(route));
    const isGuestRoute = GUEST_ROUTES.some((route) => pathname === route);
    const isProtectedRoute = PROTECTED_ROUTES.some((route) => pathname.startsWith(route));
    const isAdminRoute = ADMIN_ROUTES.some((route) => pathname.startsWith(route));

    // --- Admin Route Handling (Your logic is fine, no changes needed) ---
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
                // If /auth/me fails, try to refresh before kicking out
                if (refresh) {
                    return refreshTokenAndRedirect(request);
                }
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

    // --- Token Refresh Logic ---
    if (!access && refresh) {
        if (isProtectedRoute || isAdminRoute) {
            return refreshTokenAndRedirect(request);
        }
    }

    // --- Session-based Redirects ---
    const hasValidSession = !!access;

    if (hasValidSession) {
        if (isAuthRoute || isGuestRoute) {
            url.pathname = "/dashboard/home";
            return NextResponse.redirect(url);
        }
    } else {
        if (isProtectedRoute || isAdminRoute) {
            url.pathname = "/login";
            return NextResponse.redirect(url);
        }
    }

    return NextResponse.next();
}


// Refactored Refresh Token Function
async function refreshTokenAndRedirect(request: NextRequest) {
    const refresh = request.cookies.get("refresh_token")?.value;
    const originalUrl = request.nextUrl.clone(); // The URL we want to go to


    // If for some reason refresh token isn't here, go to login
    if (!refresh) {
        const loginUrl = new URL("/login", request.url);
        return NextResponse.redirect(loginUrl);
    }

    try {
        const res = await fetch(`${process.env.API_URL}/user/refresh`, {
            method: "GET",
            headers: { Cookie: `refresh_token=${refresh}` },
        });
        
        // If refresh fails, delete cookies and redirect to login
        if (!res.ok) {
            throw new Error("Token refresh failed");
        }
        
        const { accessToken, refreshToken } = parseTokensFromHeaders(res.headers);
        
        if (!accessToken || !refreshToken) {
            throw new Error("New tokens not found in response");
        }
        
        // Create a redirect response to the original URL
        const response = NextResponse.redirect(originalUrl);
        
        // Set the new cookies on the redirect response
        response.cookies.set({
            name: "access_token",
            value: accessToken.value,
            maxAge: accessToken.maxAge || 3600, // 1 hour
            httpOnly: true,
            path: "/",
            sameSite: "lax",
            secure: process.env.NODE_ENV === "production",
        });

        response.cookies.set({
            name: "refresh_token",
            value: refreshToken.value,
            maxAge: refreshToken.maxAge || 2592000, // 30 days
            httpOnly: true,
            path: "/",
            sameSite: "lax",
            secure: process.env.NODE_ENV === "production",
        });
        
        return response;

    } catch (error) {
        console.error("Failed to refresh token:", error);
        
        // If anything goes wrong, clear cookies and redirect to login
        const loginUrl = new URL("/login", request.url);
        const response = NextResponse.redirect(loginUrl);
        response.cookies.delete("access_token");
        response.cookies.delete("refresh_token");
        return response;
    }
}

// Config (No changes needed)
export const config = {
    matcher: [
        "/((?!api|_next/static|_next/image|favicon.ico|favicon.png|sitemap.xml|robots.txt|.*\\.png).*)",
    ],
};
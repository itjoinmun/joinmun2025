// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getUserProfile, refreshAccessToken } from './src/utils/helpers/fetch/auth/auth'

function setHeaders(response: NextResponse, userData: any) {
  response.headers.set('x-user-id', userData.UserID)
  response.headers.set('x-user-role', userData.Role)
  response.headers.set('x-user-username', userData.Username)
  response.headers.set('x-user-email', userData.Email)
}

export async function middleware(request: NextRequest) {
  const accessToken = request.cookies.get('access_token')?.value
  const refreshToken = request.cookies.get('refresh_token')?.value

  // Define public paths that don't require authentication
  const publicPaths = ['/', '/theme', '/login', '/register', '/forgot-password']

  const currentPath = request.nextUrl.pathname
  
  // Check if path is admin-related
  const isAdminPath = currentPath.startsWith('/admin')

  // Check if current path is public
  const isPublicPath =
    publicPaths.some(
      (path) =>
        currentPath === path || (path !== '/' && currentPath.startsWith(path))
    )

  // If we have tokens, try to validate and set headers regardless of path
  let userData = null
  let validAuth = false

  // Check if access token is valid
  if (accessToken) {
    try {
      const res = await getUserProfile(accessToken)

      if (res.ok) {
        // Token is valid, get user data and set headers
        userData = res.data.user
        validAuth = true
        // If accessing admin path, check if user has admin role
        if (isAdminPath && userData?.Role !== 'admin') {
          // User is not admin, redirect to dashboard or home
          return NextResponse.redirect(new URL('/dashboard', request.url))
        }

        // If on a public path, still set headers but allow access
        if (isPublicPath) {
          const response = NextResponse.next()
          setHeaders(response, userData)
          return response
        }

        // For protected paths, continue with valid auth
        const response = NextResponse.next()
        setHeaders(response, userData)
        return response
      }
    } catch (error) {
      console.error('Access token validation error:', error)
    }
  }

  // If access token failed, try refresh token
  if (!validAuth && refreshToken) {
    try {
      const res = await refreshAccessToken(refreshToken, false)

      if (res.ok) {
        const setCookieHeader = res.headers.get('set-cookie');
        if (!setCookieHeader) {
          const response = isPublicPath 
            ? NextResponse.next() 
            : NextResponse.redirect(new URL('/login', request.url));
          
          return response;
        }
        const accessToken = setCookieHeader.split(';')[0].split('=')[1];
        // Make a request to fetch user data with the new cookie
        const userRes = await getUserProfile(accessToken);
      
        if (!userRes.ok) {
          const response = NextResponse.redirect(new URL('/login', request.url));
          response.cookies.delete('access_token');
          response.cookies.delete('refresh_token');
          return response;
        }
      
      const userData = userRes.data.user;
      
        // Admin path check
        if (isAdminPath && userData?.Role !== 'admin') {
          const response = NextResponse.redirect(new URL('/dashboard', request.url));
          response.cookies.delete('access_token');
          response.cookies.delete('refresh_token');
          return response;
        }
      
        // Continue with response
        const response = NextResponse.next();
        response.headers.set('Set-Cookie', setCookieHeader);
        setHeaders(response, userData);
        
        return response;
      } else {
        // Refresh token is invalid, clear cookies and redirect
        const response = isPublicPath 
          ? NextResponse.next() 
          : NextResponse.redirect(new URL('/login', request.url));
        
        // Clear invalid tokens
        response.cookies.delete('access_token');
        response.cookies.delete('refresh_token');
        return response;
      }

    } catch (error) {
      // Handle refresh token error
      console.error('Refresh token error:', error);
      
      // Clear invalid tokens on error
      const response = isPublicPath 
        ? NextResponse.next() 
        : NextResponse.redirect(new URL('/login', request.url));
      
      response.cookies.delete('access_token');
      response.cookies.delete('refresh_token');
      return response;
    }
  }

  // If authentication failed but path is public, allow access without auth
  if (isPublicPath) {
    return NextResponse.next()
  }

  // Otherwise, redirect to login and clear any existing tokens
  const response = NextResponse.redirect(new URL('/login', request.url));
  response.cookies.delete('access_token');
  response.cookies.delete('refresh_token');
  return response;
}

// Configure which paths the middleware runs on
export const config = {
  matcher: [
    // Apply to all routes except public assets, api routes, and specific public pages
    '/((?!_next/static|_next/image|.*\\.png$|.*\\.jpg$|.*\\.webp$|favicon.ico|api/refresh-token|api/public).*)',
  ],
}
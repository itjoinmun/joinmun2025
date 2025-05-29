"use server";

import { cookies } from "next/headers";

const API_URL = process.env.API_URL || "http://localhost:3000/api/v1";

export type AuthResponse = {
  message: string;
  accessToken?: string;
  refreshToken?: string;
  user?: {
    UserID: number;
    Email: string;
    Username: string;
    Role: string;
  };
};

export type AuthResponseApi = {
  data: AuthResponse;
  status: number;
  ok: boolean;
  headers: Headers;
};

export async function register(
  data: {
    username: string;
    email: string;
    password: string;
  },
  isPublic?: boolean,
): Promise<AuthResponseApi> {
  const res = await fetch(`${API_URL}/user/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const resBody = await res.json();
  return {
    data: resBody,
    status: res.status,
    ok: res.ok,
    headers: res.headers,
  };
}

export async function login(data: { email: string; password: string }): Promise<AuthResponseApi> {
  const res = await fetch(`${API_URL}/user/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Login failed");
  }
  const resBody = await res.json();

  // Get tokens from headers and set them in cookies
  const { accessToken, refreshToken } = parseTokensFromHeaders(res.headers);
  const cookieStore = await cookies();
  if (accessToken && refreshToken) {
    cookieStore.set("access_token", accessToken.value, {
      path: accessToken.path,
      maxAge: accessToken.maxAge || 900,
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });
    cookieStore.set("refresh_token", refreshToken.value, {
      path: refreshToken.path,
      maxAge: refreshToken.maxAge || 2592000,
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });
  }

  return {
    data: resBody,
    status: res.status,
    ok: res.ok,
    headers: res.headers,
  };
}

export async function forgotPassword(
  data: {
    email: string;
  },
  isPublic?: boolean,
): Promise<{ message: string }> {
  const res = await fetch(`${API_URL}/user/forgot-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Failed to send reset link");
  }

  return res.json();
}

export async function resetPassword(
  data: {
    token: string;
    newPassword: string;
  },
  isPublic?: boolean,
): Promise<{ message: string }> {
  const res = await fetch(`${API_URL}/user/reset-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Failed to reset password");
  }

  return res.json();
}

export async function logout(): Promise<{ message: string }> {
  const { accessToken } = await getTokensFromCookies();

  const res = await fetch(`${API_URL}/auth/logout`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      Cookie: `access_token=${accessToken}`,
    },
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Logout failed");
  }

  return res.json();
}

export async function getUserProfile(): Promise<AuthResponseApi> {
  const { accessToken } = await getTokensFromCookies();

  const res = await fetch(`${API_URL}/auth/me`, {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      Cookie: `access_token=${accessToken}`,
    },
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Failed to fetch user profile");
  }
  const resBody = await res.json();

  return {
    data: resBody,
    status: res.status,
    ok: res.ok,
    headers: res.headers,
  };
}

export async function refreshAccessToken(
  refreshToken: string,
  isPublic?: boolean,
): Promise<AuthResponseApi> {
  const res = await fetch(`${API_URL}/user/refresh`, {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      Cookie: `refresh_token=${refreshToken}`,
    },
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Failed to refresh access token");
  }

  const resBody = await res.json();

  return {
    data: resBody,
    status: res.status,
    ok: res.ok,
    headers: res.headers,
  };
}

/**
 * This function extracts access and refresh tokens from the response headers.
 * It assumes that the tokens are set in the "set-cookie" header.
 * It returns an object containing the accessToken and refreshToken if they exist.
 * If the tokens are not found, it returns an empty object.
 */
interface CookieDetails {
  value: string;
  path?: string;
  domain?: string;
  maxAge?: number;
  httpOnly?: boolean;
  secure?: boolean;
  sameSite?: string;
}

interface ParsedCookies {
  accessToken?: CookieDetails;
  refreshToken?: CookieDetails;
}

function parseTokensFromHeaders(headers: Headers): ParsedCookies {
  // Get the 'set-cookie' header
  const setCookieHeader = headers.get("set-cookie");
  if (!setCookieHeader) {
    return {};
  }

  const parsedCookies: ParsedCookies = {};
  const cookieStrings = setCookieHeader.split(", "); // Split cookies by comma and space

  cookieStrings.forEach((cookieString) => {
    const parts = cookieString.split(";").map((part) => part.trim());
    const [nameValuePair, ...attributes] = parts;
    const [cookieName, cookieValue] = nameValuePair.split("=").map((part) => part.trim());

    if (cookieName === "access_token" || cookieName === "refresh_token") {
      const details: CookieDetails = { value: cookieValue };
      attributes.forEach((attr) => {
        const [attrName, attrValue] = attr.split("=").map((part) => part.trim());
        switch (attrName.toLowerCase()) {
          case "path":
            details.path = attrValue;
            break;
          case "domain":
            details.domain = attrValue;
            break;
          case "max-age":
            details.maxAge = parseInt(attrValue, 10);
            break;
          case "httponly":
            details.httpOnly = true;
            break;
          case "secure":
            details.secure = true;
            break;
          case "samesite":
            details.sameSite = attrValue;
            break;
        }
      });

      if (cookieName === "access_token") {
        parsedCookies.accessToken = details;
      } else if (cookieName === "refresh_token") {
        parsedCookies.refreshToken = details;
      }
    }
  });

  return parsedCookies;
}

export async function getTokensFromCookies() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token");
  const refreshToken = cookieStore.get("refresh_token");

  return {
    accessToken,
    refreshToken,
  };
}

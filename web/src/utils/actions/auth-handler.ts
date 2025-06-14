"use server";

import { cookies } from "next/headers";
import { parseTokensFromHeaders } from "../helpers/fetch/headers";

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

const register = async (data: {
  username: string;
  email: string;
  password: string;
}): Promise<AuthResponseApi> => {
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
};

const forgotPassword = async (data: { email: string }): Promise<{ message: string }> => {
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
};

const resetPassword = async (data: {
  token: string;
  newPassword: string;
}): Promise<{ message: string }> => {
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
};

const getUserProfile = async (): Promise<AuthResponseApi> => {
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
};

/**
 * This function extracts access and refresh tokens from the response headers.
 * It assumes that the tokens are set in the "set-cookie" header.
 * It returns an object containing the accessToken and refreshToken if they exist.
 * If the tokens are not found, it returns an empty object.
 */

const getTokensFromCookies = async () => {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value;
  const refreshToken = cookieStore.get("refresh_token")?.value;

  return {
    accessToken,
    refreshToken,
  };
};

export {
  register,
  forgotPassword,
  resetPassword,
  getUserProfile,
  getTokensFromCookies,
};

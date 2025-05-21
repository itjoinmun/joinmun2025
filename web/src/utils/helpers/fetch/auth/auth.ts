// lib/api/auth.ts
const API_BASE = process.env.API_URL || "http://localhost:8080/api/v1";
const PUBLIC_API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1";

// Helper function to determine which base URL to use
const getBaseUrl = (isPublic?: boolean): string => {
  return isPublic ? PUBLIC_API_BASE : API_BASE;
};

export type AuthResponse = {
    message: string;
    accessToken?: string;
    refreshToken?: string;
    user?: {
        UserID: number;
        Email: string;
        Username: string;
        Role: string;
    }
};

export type AuthResponseApi = {
    data: AuthResponse;
    status: number;
    ok: boolean;
    headers: Headers;
}

export async function register(data: {
  username: string;
  email: string;
  password: string;
}, isPublic?: boolean): Promise<AuthResponseApi> {
  const res = await fetch(`${getBaseUrl(isPublic)}/user/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Registration failed");
  }

  const resBody = await res.json();
  return {
    data: resBody,
    status: res.status,
    ok: res.ok,
    headers: res.headers,
  };
}

export async function login(data: {
  email: string;
  password: string;
}, isPublic?: boolean): Promise<AuthResponseApi> {
  const res = await fetch(`${getBaseUrl(isPublic)}/user/login`, {
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

  return {
    data: resBody,
    status: res.status,
    ok: res.ok,
    headers: res.headers,
  };
}

export async function forgotPassword(data: {
  email: string;
}, isPublic?: boolean): Promise<{ message: string }> {
  const res = await fetch(`${getBaseUrl(isPublic)}/user/forgot-password`, {
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

export async function resetPassword(data: {
  token: string;
  newPassword: string;
}, isPublic?: boolean): Promise<{ message: string }> {
  const res = await fetch(`${getBaseUrl(isPublic)}/user/reset-password`, {
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

export async function logout(accessToken: string, isPublic?: boolean): Promise<{ message: string }> {
  const res = await fetch(`${getBaseUrl(isPublic)}/auth/logout`, {
    method: "POST",
    credentials: "include",
    headers: { 
        "Content-Type": "application/json",
        Cookie: `access_token=${accessToken}`
    },
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Logout failed");
  }

  return res.json();
}

export async function getUserProfile(accessToken: string, isPublic?: boolean): Promise<AuthResponseApi> {
    const res = await fetch(`${getBaseUrl(isPublic)}/auth/me`, {
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

export async function refreshAccessToken(refreshToken: string, isPublic?: boolean): Promise<AuthResponseApi> {
    const res = await fetch(`${getBaseUrl(isPublic)}/user/refresh`, {
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


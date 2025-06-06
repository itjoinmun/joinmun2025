"use server";

import { cookies } from "next/headers";

const getSession = async (): Promise<Session | null> => {
  const cookieStore = await cookies();
  const access = cookieStore.get("access_token")?.value;

  try {
    const res = await fetch(`${process.env.API_URL}/auth/me`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Cookie: `access_token=${access}`,
      },
    });

    const data = await res.json();

    if (!res.ok) {
      console.error("Failed to fetch session:", data);
      return null;
    }

    return {
      user: data.user.UserID,
      email: data.user.Email,
      name: data.user.Username,
      role: data.user.Role,
    };
  } catch (error) {
    console.error("Error fetching session:", error);
    return null;
  }
};

export interface Session {
  user: number;
  email: string;
  name: string;
  role: string;
}

export { getSession };

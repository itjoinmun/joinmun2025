"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const getSession = async (): Promise<Session> => {
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
    }).then((res) => res.json());

    if (!res.ok) {
      throw new Error("Failed to fetch session data");
    }

    const data = await res.json();

    return {
      user: data.user.UserID,
      email: data.user.Email,
      name: data.user.Username,
      role: data.user.Role,
    };
  } catch (error) {
    console.error("Error fetching session:", error);
    cookieStore.delete("access_token");
    cookieStore.delete("refresh_token");
    redirect("/login");
  }
};

export interface Session {
  user: number;
  email: string;
  name: string;
  role: string;
}

export { getSession };

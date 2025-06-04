"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const getSession = async (): Promise<Session> => {
  const cookieStore = await cookies();
  const access = cookieStore.get("access_token")?.value;

  if (!access) {
    return redirect("/login");
  }

  try {
    const res = await fetch(`${process.env.API_URL}/auth/me`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Cookie: `access_token=${access}`,
      },
      next: {
        revalidate: 30,
      },
    }).then((res) => res.json());

    return {
      user: res.user.UserID,
      email: res.user.Email,
      name: res.user.Username,
      role: res.user.Role,
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

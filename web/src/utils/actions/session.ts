"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { refreshToken } from "./auth-handler";

const getSession = async (): Promise<sessionReturnType> => {
  const cookieStore = await cookies();
  const access = cookieStore.get("access_token")?.value;
  const refresh = cookieStore.get("refresh_token")?.value;

  if (refresh) {
    try {
      await refreshToken(refresh);
    } catch (error) {
      console.error("Error refreshing token:", error);
      redirect("/login");
    }
  }

  try {
    const res = await fetch(`${process.env.API_URL}/auth/session`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Cookie: `access_token=${access}`,
      },
    }).then((res) => res.json());

    return {
      user: res.user.UserID,
      email: res.user.Email,
      name: res.user.Username,
    };
  } catch (error) {
    console.error("Error fetching session:", error);
    redirect("/login");
  }
};

interface sessionReturnType {
  user: number;
  email: string;
  name: string;
}

export { getSession };

import { parseTokensFromHeaders } from "@/utils/helpers/fetch/headers";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const { email, password } = await request.json();

  try {
    const res = await fetch(`${process.env.API_URL}/user/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        email,
        password,
      }),
    });

    const { accessToken, refreshToken } = parseTokensFromHeaders(res.headers);

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

    return NextResponse.json(res, { status: res.status });
  } catch (err) {
    return NextResponse.json({ message: "An unexpected error occurred" }, { status: 500 });
  }
}

import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value;
  const refreshToken = cookieStore.get("refresh_token")?.value;

  try {
    const res = await fetch(`${process.env.API_URL}/auth/logout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: `access_token=${accessToken}; refresh_token=${refreshToken}`,
      },
    });

    cookieStore.delete("access_token");
    cookieStore.delete("refresh_token");

    return NextResponse.json(res, { status: res.status });
  } catch (err) {
    return NextResponse.json({ message: "An unexpected error occurred" }, { status: 500 });
  }
}

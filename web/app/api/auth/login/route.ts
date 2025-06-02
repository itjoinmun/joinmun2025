import { NextResponse } from "next/server";

export async function POST(request: Request) {
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

    return NextResponse.json(res, { status: res.status, headers: res.headers });
  } catch {
    return NextResponse.json({ message: "An unexpected error occurred" }, { status: 500 });
  }
}
